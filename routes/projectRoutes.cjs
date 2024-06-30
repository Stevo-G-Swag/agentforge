const express = require('express');
const generateCode = require('../services/aiService');
const router = express.Router();

router.get('/new', (req, res) => {
  res.render('createProject', { csrfToken: req.csrfToken() });
});

router.post('/create', async (req, res) => {
  const { description } = req.body;
  console.log('Received project description:', description);
  console.log('Project description received for code generation:', description);
  try {
    const generatedCode = await generateCode(description);
    req.session.generatedCode = generatedCode;
    res.render('reviewCode', { code: generatedCode, csrfToken: req.csrfToken() });
  } catch (error) {
    console.error('Project creation error:', error);
    console.error(error.stack);
    res.status(500).send('Failed to generate project code.');
  }
});

router.post('/approve', async (req, res) => {
  try {
    const { generatedCode } = req.session;
    if (!generatedCode) {
      throw new Error("No generated code available in session.");
    }
    console.log('Approved code:', generatedCode);
    res.send('Code approved and saved successfully!');
  } catch (error) {
    console.error('Approval error:', error);
    console.error(error.stack);
    res.status(500).send('Failed to approve project code.');
  }
});

router.get('/edit', (req, res) => {
  res.render('codeEditor', { csrfToken: req.csrfToken() });
});

module.exports = router;