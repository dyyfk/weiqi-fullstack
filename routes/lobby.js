const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const { isLoggedIn } = require('../config/auth');

router.get('/', ensureAuthenticated, (req, res) => {
    res.render('lobby', {
        user: req.user
    });
});

module.exports = router;



