require('dotenv').config();
const express = require('express');
const { deployToHeroku } = require('./services/deploymentService');

const app = express();
app.use(express.json());

app.post('/deploy', async (req, res) => {
  try {
    const { appName } = req.body;
    if (!appName) {
      return res.status(400).json({ error: 'appName is required' });
    }
    const deploymentResult = await deployToHeroku(appName);
    res.status(200).json(deploymentResult);
  } catch (error) {
    console.error('Error deploying:', error);
    res.status(500).json({ error: 'Deployment failed' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;