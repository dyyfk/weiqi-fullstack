const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { returnTo } = require('../config/auth');
router.get('/register', (req, res) => {
    res.render('register', {
        clean: true
    });
});

router.get('/login', (req, res) => {
    res.render('login', {
        clean: true
    });
});


router.post('/register', async (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
    // Check required fields

    // TODO: use validation package here
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'please fill all fields' });
    }

    // check passwords match

    if (password !== password2) {
        errors.push({ msg: 'passwords do not match' });
    }

    // check pass length
    if (password.length < 6) {
        errors.push({ msg: 'password should be at least 6 characters' });
    }

    let emailRegistered = await User.findOne({ 'local.email': email });
    let nameRegistered = await User.findOne({ name });

    if (nameRegistered) {
        errors.push({ msg: 'name has been registered' });
    }
    if (emailRegistered) {
        errors.push({ msg: 'email has been registered' });
    }


    if (errors.length > 0) {
        res.render('register', {
            errors, name, email, password, password2
        });
    } else {
        const newUser = new User({
            errors, name, 'local.email': email, 'local.password': password, password2
        });

        bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err;
            bcrypt.hash(newUser.local.password, salt, (err, hash) => {
                if (err) throw err;

                newUser.local.password = hash;

                newUser.save().then(user => {
                    req.flash('success_msg', 'you are now registered');
                    res.redirect('/users/login');
                }).catch(err => console.log(err));

            });
        });
    }
 

});

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/users/login/redirect',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/login/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/login/google/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/users/login/redirect');
});

router.get('/login/redirect', (req, res, next) => {
    res.redirect(returnTo(req, res, next));
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;