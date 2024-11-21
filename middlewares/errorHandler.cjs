const errorHandler = (err, req, res, next) => {
  const errorResponse = {
    message: "There was an error serving your request.",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  };

  console.error(`Unhandled application error: ${err.message}`);
  console.error(err.stack);

  res.status(500).json(errorResponse);
};

module.exports = errorHandler;
