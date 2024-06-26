const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User.js');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).send('User registered successfully');
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

module.exports = router;