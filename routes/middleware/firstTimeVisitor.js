const express = require('express');

const firstTimeVisitor = (req, res, next) => {
    if (!req.cookies.firstVisit) {
        res.cookie('firstVisit', '1', { maxAge: 24 * 60 * 60 * 1000, httpOnly: true }); // Expires in 1 day
        console.log('First time visitor, redirecting to register page.');
        res.redirect('/auth/register');
    } else {
        console.log('Returning visitor, proceeding to next middleware.');
        next();
    }
};

module.exports = firstTimeVisitor;