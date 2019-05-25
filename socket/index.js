const Room = require('../models/Room');
const User = require('../models/User');

const ioEvents = function (io) {

    io.on('connection', socket => {
        socket.on('join', room_id => {
            Room.findById(room_id, (err, room) => {
                if (err) throw err;
                if (!room) {
                    socket.emit('updateUserList', { eroor: 'Room does not exist' });
                    // TODO: This is for the future feature like deleting a room, but users
                    // have the old link so they can still access the room
                } else {
                    if (socket.request.session.passport == null) {
                        return; // in case the session has expired 
                    }
                    const user_id = socket.request.session.passport.user;
                    const socket_id = socket.id;
                    const conn = { userId: user_id, socketId: socket_id };
                    room.connections.push(conn);
                    room.save((err, newRoom) => {
                        if (err) throw err;
                        socket.join(newRoom.id);

                        // Room.

                        // socket.emit('updateUsersList', users, true);
                    });
                    // Room.update();
                    // User.findById(user_id).then(user => {
                    //     if (!user) {
                    //         socket.emit('user');
                    //     }
                    // });

                    // Room.update({

                    // });


                }
            });



            // socket.on('updateUsersList', function (users) {



            // });
            // var name = params.name;
            // name = `test-${count++}`; // This should be from cache ultimately
            // var room = params.room;
            // // var isPlayer = params.isPlayer;
            // var message = params.message;
            // socket.join(room);
            // socket.emit('updateUserlist', name);
            // // socket.join(params);
        });





        socket.on('sendMeg', (message) => {



            // var id = socket.id;
            // var user = users.getUser(id);
            // var room = user.room;
            // var name = user.name;
            // message.from = name;
            // io.to(room).emit('receiveMeg', message);
        });
    });

    // // Rooms namespace
    // io.of('/rooms').on('connection', function (socket) {

    //     // Create a new room
    //     socket.on('createRoom', function (title) {
    //         Room.findOne({ 'title': new RegExp('^' + title + '$', 'i') }, function (err, room) {
    //             if (err) throw err;
    //             if (room) {
    //                 socket.emit('updateRoomsList', { error: 'Room title already exists.' });
    //             } else {
    //                 Room.create({
    //                     title: title
    //                 }, function (err, newRoom) {
    //                     if (err) throw err;
    //                     socket.emit('updateRoomsList', newRoom);
    //                     socket.broadcast.emit('updateRoomsList', newRoom);
    //                 });
    //             }
    //         });
    //     });
    // });


    // io.of('/chatroom').on('connection', function (socket) {

    //     // Join a chatroom
    //     socket.on('join', function (room) {
    //         socket.join(room);
    //     });
    // });

    io.on('disconnect', function () {
        console.log('Connection lost');
    });

};

module.exports = function (app) {

    const server = require('http').Server(app);
    const io = require('socket.io')(server);

    io.use((socket, next) => {
        require('../session')(socket.request, socket.request.res || {}, next);
    });
    // // Define all Events
    ioEvents(io);

    // The server object will be then used to list to a port number
    return server;
};