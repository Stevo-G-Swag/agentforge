const redirectIfAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        console.log(`Redirecting authenticated user with ID ${req.session.userId} to home page.`);
        res.redirect('/');
    } else {
        console.log('No user session found, proceeding to next middleware.');
        next();
    }
};

module.exports = redirectIfAuthenticated;