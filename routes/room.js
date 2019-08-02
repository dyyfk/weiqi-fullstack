const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Room = require('../models/Room');



router.get('/:id', (req, res) => {

    let roomId = req.params.id;

    Room.findById(roomId, (err, room) => {
        if (err || !room) {
            // TODO: there should be some error message for the front-end
            console.log(err || 'Room does not exist');
            res.render('error');
            return;
        }
        res.render('chessroom', {
            user: req.user,
            game: true,
            footer: false
        });
    });


});

module.exports = router;



