const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
    // Check required fields

    // TODO: use validation package here
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // check passwords match

    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    // check pass length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }


    if (errors.length > 0) {
        res.render('register', {
            errors, name, email, password, password2
        });
    } else {
        User.findOne({ email }).then(user => {
            if (user) {
                errors.push({ msg: 'Email has been registered' });
                res.render('register', {
                    errors, name, email, password, password2
                });
            } else {
                const newUser = new User({
                    errors, name, email, password, password2
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;

                        newUser.password = hash;

                        newUser.save().then(user => {
                            req.flash('success_msg', 'You are now registered');
                            res.redirect('/users/login');
                        }).catch(err => console.log(err));

                    });
                });

                // res.redirect('/users/login');
            }
        });
    }

});

module.exports = router;