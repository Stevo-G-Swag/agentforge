const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User.js');
const router = express.Router();
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated');

router.use(redirectIfAuthenticated);

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    req.session.userId = newUser._id;  // Set user session ID after registration
    res.redirect('/auth/login');  // Redirect to login after registration
  } catch (error) {
    console.error('Registration error:', error);
    console.error(error.stack);
    res.status(500).send('Failed to register user.');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.userId = user._id;
      res.send('User logged in successfully');
    } else {
      res.status(401).send('Invalid username or password');
    }
  } catch (error) {
    console.error('Login error:', error);
    console.error(error.stack);
    res.status(500).send('Failed to log in.');
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      console.error(err.stack);
      res.status(500).send('Failed to log out.');
    } else {
      res.send('User logged out successfully');
    }
  });
});

router.post('/reauthenticate', (req, res) => {
  if (!req.session || !req.session.userId) {
    console.error('Reauthentication error: No active session');
    console.error('Reauthentication error: User session not found. Request ID: nWJ9O-khvknjOqwc8QYZWJzjRT2JdAsj');
    res.status(401).send('Session expired. Please log in again.');
  } else {
    res.send('Session is active.');
  }
});

router.get('/login', (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
});

router.get('/register', (req, res) => {
  res.render('register', { csrfToken: req.csrfToken() });
});

module.exports = router;