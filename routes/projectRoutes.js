const express = require('express');
const router = express.Router();

router.get('/new', (_req, res) => {
  try {
    res.render('createProject');
  } catch (error) {
    console.error('Error rendering /new:', error);
    console.error(error.stack);
    res.status(500).json({ error: 'Failed to render the create project page' });
  }
});

module.exports = router;