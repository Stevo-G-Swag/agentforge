const express = require('express');
const { generateBasicTests } = require('../services/testGenerationService');
const { deployToHeroku } = require('../services/deploymentService');
const { provideCodeSuggestions } = require('../services/codeSuggestionService');
const router = express.Router();

router.post('/generate-tests', (req, res) => {
  try {
    const tests = generateBasicTests();
    res.send({ tests });
  } catch (error) {
    console.error('Error generating tests:', error);
    console.error(error.stack);
    res.status(500).send('Failed to generate tests');
  }
});

router.post('/deploy', async (req, res) => {
  try {
    const { codePath } = req.body;
    const deploymentStatus = await deployToHeroku(codePath);
    res.send(deploymentStatus);
  } catch (error) {
    console.error('Deployment error:', error);
    console.error(error.stack);
    res.status(500).send('Failed to deploy application');
  }
});

router.post('/code-suggestions', async (req, res) => {
  try {
    const { codeContent } = req.body;
    const suggestions = await provideCodeSuggestions(codeContent);
    res.send(suggestions);
  } catch (error) {
    console.error('Error providing code suggestions:', error);
    console.error(error.stack);
    res.status(500).send('Failed to provide code suggestions');
  }
});

module.exports = router;