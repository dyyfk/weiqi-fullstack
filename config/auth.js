module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            req.session.returnTo = req.originalUrl;
            req.flash('error_msg', 'Please log in to view this page');
            res.redirect('/users/login');
        }
    },
    isLoggedIn: function (req, res, next) {
        next();
        return req.isAuthenticated();
    },
    returnTo: function (req, res, next) {
        // next();
        // console.log(req.session);
        const originalUrl = req.session.returnTo;
        delete req.session.returnTo;
        return originalUrl || '/dashboard';
    }
};