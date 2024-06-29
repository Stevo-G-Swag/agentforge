const express = require('express');

const sessionMiddleware = (req, res, next) => {
    if (req.session) {
        res.locals.session = req.session;
        console.log('Session data attached to res.locals');
    } else {
        console.log('No session data to attach to res.locals');
    }
    next();
};

module.exports = sessionMiddleware;