const express = require('express');
const Component = require('../models/Component');
const { isAuthenticated } = require('./middleware/authMiddleware');
const csrfProtection = require('../middlewares/csrfProtection');
const router = express.Router();

// POST route to add a new component
router.post('/components', isAuthenticated, csrfProtection, async (req, res) => {
  try {
    const { name, description, codeSnippet } = req.body;
    const newComponent = new Component({ name, description, codeSnippet });
    await newComponent.save();
    res.status(201).json(newComponent);
  } catch (error) {
    console.error('Error adding new component:', error);
    console.error(error.stack);
    res.status(400).json({ error: error.message });
  }
});

// GET route to search components
router.get('/components', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const options = {
      page,
      limit,
      sort: { name: 1 },
      select: 'name description',
    };
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    const components = await Component.paginate(query, options);
    res.status(200).json(components);
  } catch (error) {
    console.error('Error searching components:', error);
    console.error(error.stack);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;