require('dotenv').config(); // Ensure this line is at the very top of your file

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const projectRoutes = require('./routes/projectRoutes.cjs');
const deploymentRoutes = require('./routes/deploymentRoutes.cjs');
const authRoutes = require('./routes/authRoutes.cjs');
const componentRoutes = require('./routes/componentRoutes');
const projectModifyRoutes = require('./routes/projectModifyRoutes.js');
const { isAuthenticated } = require('./routes/middleware/authMiddleware');
const csrfProtection = require('./middlewares/csrfProtection.js');
const path = require('path');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');
const detectPort = require('detect-port');
const firstTimeVisitor = require('./routes/middleware/firstTimeVisitor');

const app = express();
const defaultPort = 3000;

console.log('OpenAI API Key:', process.env.OPENAI_API_KEY); // Debugging line to check API key loading

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware for CSRF token handling
app.use(cookieParser());

// MongoDB connection
const mongoUri = process.env.DATABASE_URL;

// Set `strictQuery` to false to address Mongoose deprecation warning
mongoose.set('strictQuery', false);

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: mongoUri }),
  cookie: {
    secure: false, // Modified to ensure cookies are sent over both secure and insecure connections during development
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
}));

// Attach session to res.locals to make it available in EJS views
app.use((req, res, next) => {
  if (req.session) {
    res.locals.session = req.session;
    console.log('Session data attached to res.locals');
  } else {
    console.log('No session data to attach to res.locals');
  }
  next();
});

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// CSRF protection middleware should be applied after session middleware
app.use(csrfProtection);

// Apply firstTimeVisitor middleware globally
app.use(firstTimeVisitor);

// Routes
app.use('/projects', isAuthenticated, projectRoutes, projectModifyRoutes);
app.use('/deploy', isAuthenticated, deploymentRoutes);
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/', indexRoutes);
app.use('/components', componentRoutes);

// Default route
app.get('/', (_req, res) => {
  res.render('index');
});

// New route for /components endpoint
app.get('/components', (_req, res) => {
  res.render('components');
});

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).send('CSRF token validation failed');
  } else if (err.message.includes('Session not found')) {
    res.redirect('/auth/login');
  } else {
    res.status(500).send('Something broke!');
  }
});

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('modifyCode', (data) => {
    socket.broadcast.emit('codeUpdated', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server on an available port
detectPort(defaultPort, (err, port) => {
  if (err) {
    console.error('Error finding an available port:', err);
    return;
  }
  if (port === defaultPort) {
    console.log(`Port ${defaultPort} is available.`);
  } else {
    console.log(`Port ${defaultPort} is in use. Using available port: ${port}`);
  }
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`OpenAI API Key set: ${process.env.OPENAI_API_KEY ? 'Yes' : 'No'}`);
    console.log('Session management initialized.');
  });

  server.timeout = 1000000; // Set timeout to a higher value
});

module.exports = app; // Export the app for testing purposes