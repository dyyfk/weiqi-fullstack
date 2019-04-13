const express = require('express');
const router = express.Router();




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
        res.send('pass');
    }

});

module.exports = router;