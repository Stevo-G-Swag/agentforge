const sessionMiddleware = (req, res, next) => {
    res.locals.session = req.session;
    console.log('Session middleware attached session to response locals.');
    next();
};

module.exports = sessionMiddleware;