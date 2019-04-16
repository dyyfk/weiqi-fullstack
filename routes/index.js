const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');


router.get('/', ensureAuthenticated, (req, res) => {
    res.render('welcome', {
        user: req.user
    });
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
        user: req.user
    });
});

module.exports = router;