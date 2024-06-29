const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  } else {
    console.error(`Authentication error: User session not found. Request ID: ${req.sessionID}`);
    console.error('Session retrieval failed:', new Error('Session not found'));
    console.error(new Error('Session not found').stack);
    res.status(401).send('Authentication failed. Please log in to continue.');
    console.error('Detailed error: Failed to retrieve session during authentication process.');
    console.error(`Session details: Session ID ${req.sessionID} could not be found.`);
  }
};

module.exports = {
  isAuthenticated
};