const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  } else {
    console.error(`Authentication error: User session not found. Request ID: ${req.sessionID}`);
    return res.status(401).send('Authentication failed. Please log in to continue.');
  }
};

module.exports = {
  isAuthenticated
};