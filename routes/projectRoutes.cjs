const express = require('express');
const generateCode = require('../services/aiService.js');
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

router.post('/projects/approve', async (req, res) => {
  try {
    const { generatedCode } = req.session;
    if (!generatedCode) {
      throw new Error("No generated code available in session.");
    }
    // Here, you would typically save the approved code to a database or a file system.
    console.log('Approved code:', generatedCode);
    res.send('Code approved and saved successfully!');
  } catch (error) {
    console.error('Approval error:', error);
    console.error(error.stack);
    res.status(500).send('Failed to approve project code.');
  }
});

module.exports = router;