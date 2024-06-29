const express = require('express');
const generateCode = require('../services/aiService.js');
const router = express.Router();

router.post('/projects/create', async (req, res) => {
  const { description } = req.body;
  console.log('Received project description:', description); // Logging the project description
  try {
    const generatedCode = await generateCode(description);
    req.session.generatedCode = generatedCode; // Store the generated code in session for review
    res.redirect('/projects/review');
  } catch (error) {
    console.error('Project creation error:', error);
    console.error(error.stack);
    res.status(500).send('Failed to generate project code.');
  }
});

router.post('/projects/approve', async (req, res) => {
  try {
    const { generatedCode } = req.session;
    if (!generatedCode) {
      throw new Error("No generated code available in session.");
    }
    console.log('Approved code:', generatedCode);
    res.redirect('/dashboard'); // Assuming there is a dashboard route to redirect after approval
  } catch (error) {
    console.error('Approval error:', error);
    console.error(error.stack);
    res.status(500).send('Failed to approve project code.');
  }
});

module.exports = router;