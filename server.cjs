require('dotenv').config(); // Ensure this line is at the very top of your file

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const projectRoutes = require('./routes/projectRoutes.cjs');
const deploymentRoutes = require('./routes/deploymentRoutes.cjs');
const authRoutes = require('./routes/authRoutes.cjs');
const componentRoutes = require('./routes/componentRoutes');
const { isAuthenticated } = require('./routes/middleware/authMiddleware');
const csrfProtection = require('./middlewares/csrfProtection.js');
const path = require('path');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');
const detectPort = require('detect-port');

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
    secure: process.env.NODE_ENV === 'development' ? false : true, // Use secure cookies in production
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

// Routes
app.use('/projects', isAuthenticated, projectRoutes);
app.use('/deploy', isAuthenticated, deploymentRoutes);
app.use('/auth', authRoutes);
app.use('/api', componentRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to AgentForge! Visit /projects, /deploy, /auth for more.');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).send('CSRF token validation failed');
  } else if (err.name === 'AuthenticationError' && err.message.includes('Session expired')) {
    res.status(401).send('Session not found or has expired.');
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
});

module.exports = app; // Export the app for testing purposes