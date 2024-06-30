require('dotenv').config();
const express = require('express');
const { deployToHeroku } = require('./services/deploymentService');
const helmet = require('helmet');

const app = express();
app.use(express.json());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      "default-src": ["'self'"],
      "style-src": ["'self'", "'unsafe-inline'"]
    }
  }
}));

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
    console.error(error.stack);
    res.status(500).json({ error: 'Deployment failed' });
  }
});

app.get('/new', (req, res) => {
  res.render('createProject');
});

app.use(express.static('public'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;