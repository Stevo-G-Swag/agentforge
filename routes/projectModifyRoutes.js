const express = require('express');
const router = express.Router();

// GET request handler for modifying project details
router.get('/modify', (req, res) => {
  try {
    // Render a form for the user to modify project details
    res.render('modifyProject', { project: req.body });
  } catch (error) {
    console.error('Error on GET /projects/modify:', error);
    console.error(error.stack);
    res.status(500).send('Failed to load the project modification form');
  }
});

// POST request handler for updating project details
router.post('/modify', async (req, res) => {
  try {
    // Logic to update project details in the database
    // Placeholder for database update logic
    console.log('Received project modification data:', req.body);
    // Simulate database update operation
    // Redirect to a confirmation page or back to the project dashboard
    res.redirect('/projects/dashboard?update=success');
  } catch (error) {
    console.error('Error on POST /projects/modify:', error);
    console.error(error.stack);
    res.status(500).send('Failed to update project details');
  }
});

module.exports = router;