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

const app = express();
const PORT = process.env.PORT || 3000;

console.log('OpenAI API Key:', process.env.OPENAI_API_KEY); // Debugging line to check API key loading

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const mongoUri = process.env.DATABASE_URL;
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
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
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// CSRF protection middleware
app.use(csrfProtection);

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/projects', isAuthenticated, projectRoutes);
app.use('/deploy', isAuthenticated, deploymentRoutes);
app.use('/auth', authRoutes);
app.use('/api', isAuthenticated, csrfProtection, componentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`OpenAI API Key set: ${process.env.OPENAI_API_KEY ? 'Yes' : 'No'}`);
});

module.exports = app; // Export the app for testing purposes