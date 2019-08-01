const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const { isLoggedIn } = require('../config/auth');

router.get('/', isLoggedIn, (req, res) => {
    res.render('front-page', {
        clean: true,
        user: req.user
    });
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
        user: req.user
    });
});

router.get('/front', isLoggedIn, (req, res) => {
    res.render('front-page', {
        clean: true,
        user: req.user
    });
});

router.get('/configuration', isLoggedIn, (req, res) => {
    res.render('configuration', {
        clean: true,
        footer: true
    });
});

router.get('/playground', isLoggedIn, (req, res) => {
    res.render('playground', {
        clean: true
    });
});

module.exports = router;