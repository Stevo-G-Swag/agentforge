const csurf = require('csurf');

// Configure CSRF protection middleware to use cookies
const csrfProtection = csurf({
    cookie: true,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' // Use secure cookies in production
});

module.exports = csrfProtection;