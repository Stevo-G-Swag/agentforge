const csurf = require('csurf');

// Configure CSRF protection middleware to use cookies
const csrfProtection = csurf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'lax', // Changed to 'lax' to allow cookies in a less restrictive context
        maxAge: 3600000 // 1 hour cookie expiration
    }
});

module.exports = csrfProtection;