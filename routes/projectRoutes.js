const express = require('express');
const router = express.Router();

router.get('/projects/new', (req, res) => {
  res.render('createProject');
});

router.post('/projects/create', (req, res) => {
  const { description } = req.body;
  console.log('Project Description:', description);
  // Here you would typically add logic to parse the description and create a project structure
  res.redirect('/'); // Redirect to home or a specific page after processing
});

module.exports = router;