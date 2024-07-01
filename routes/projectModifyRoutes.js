const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project'); // Assume we have a Project model

// Middleware for input validation
const validateProjectInput = [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('description').trim().isLength({ min: 1 }).withMessage('Description is required'),
  // Add more validators as needed
];

// GET request handler for modifying project details
router.get('/modify/:id', async (req, res) => {
  try {
    const projectId = req.params.id;

    // Validate projectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).send('Invalid project ID');
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).send('Project not found');
    }

    // Render a form for the user to modify project details
    res.render('modifyProject', { project });
  } catch (error) {
    console.error('Error on GET /projects/modify:', error);
    res.status(500).send('Failed to load the project modification form');
  }
});

// POST request handler for updating project details
router.post('/modify/:id', validateProjectInput, async (req, res) => {
  try {
    const projectId = req.params.id;

    // Validate projectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).send('Invalid project ID');
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Find the project
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).send('Project not found');
    }

    // Update project details
    project.title = req.body.title;
    project.description = req.body.description;
    // Update other fields as necessary

    // Save the updated project
    await project.save();

    // Redirect to a confirmation page or back to the project dashboard
    res.redirect(`/projects/dashboard?update=success&id=${projectId}`);
  } catch (error) {
    console.error('Error on POST /projects/modify:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ errors: Object.values(error.errors).map(e => e.message) });
    }
    res.status(500).send('Failed to update project details');
  }
});

module.exports = router;