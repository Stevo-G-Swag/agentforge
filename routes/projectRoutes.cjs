const express = require('express');
const generateCode = require('../services/aiService');
const router = express.Router();

router.get('/projects/new', (req, res) => {
  res.render('createProject');
});

router.post('/projects/create', async (req, res) => {
  const { description } = req.body;
  try {
    const generatedCode = await generateCode(description);
    req.session.generatedCode = generatedCode; // Store the generated code in session for review
    res.render('reviewCode', { code: generatedCode });
  } catch (error) {
    console.error('Project creation error:', error);
    console.error(error.stack);
    res.status(500).send('Failed to generate project code.');
  }
});

router.post('/projects/approve', (req, res) => {
  const { generatedCode } = req.session;
  // Here, you would typically save the approved code to a database or a file system.
  console.log('Approved code:', generatedCode);
  res.send('Code approved and saved successfully!');
});

module.exports = router;