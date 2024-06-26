const express = require('express');
const { generateBasicTests } = require('../services/testGenerationService');
const { deployToCloud } = require('../services/deploymentService');
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
    const deploymentStatus = await deployToCloud(codePath);
    res.send(deploymentStatus);
  } catch (error) {
    console.error('Deployment error:', error);
    console.error(error.stack);
    res.status(500).send('Failed to deploy application');
  }
});

module.exports = router;