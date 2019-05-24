const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const { ensureAuthenticated } = require('../config/auth');
// const { isLoggedIn } = require('../config/auth');

router.get('/', ensureAuthenticated, (req, res) => {

    Room.find({}).then(rooms => {
        if (rooms) {
            res.render('lobby', {
                user: req.user,
                rooms
            });
        } else {
            res.render('lobby', {
                user: req.user,
            });
        }
    });
});


router.post('/createRoom', (req, res) => {
    let { title } = req.body;
    let errors = [];
    if (title.length === 0) {
        errors.push({ msg: 'Room title cannot be empty' });
        res.render('lobby', {
            errors
        });
    }
    Room.findOne({ title }).then(room => {
        if (room) {
            errors.push({ msg: 'Room has already existed' });
            res.render('lobby', {
                errors
            });
        } else {
            const newRoom = new Room({
                title
            });
            newRoom.save().then(room => {
                req.flash('success_msg', `Room ${title} has been created`);
                res.redirect('/lobby');
            }).catch(err => console.log(err));
        }
    });
});

module.exports = router;



