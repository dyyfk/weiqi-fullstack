// var Room = require('../models/room');


let count = 0;

let ioEvents = function (io) {

    io.on('connection', socket => {
        socket.on('join', params => {


            var name = params.name;
            name = `test-${count++}`; // This should be from cache ultimately
            var room = params.room;
            // var isPlayer = params.isPlayer;
            var message = params.message;
            socket.join(room);
            socket.emit('updateUserlist', name);
            // socket.join(params);
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

    // Force Socket.io to ONLY use "websockets"; No Long Polling.
    // io.set('transports', ['websocket']);

    // // Using Redis
    // let port = config.redis.port;
    // let host = config.redis.host;
    // let password = config.redis.password;
    // let pubClient = redis(port, host, { auth_pass: password });
    // let subClient = redis(port, host, { auth_pass: password, return_buffers: true, });
    // io.adapter(adapter({ pubClient, subClient }));

    // // Allow sockets to access session data
    // io.use((socket, next) => {
    //     require('../session')(socket.request, {}, next);
    // });

    // // Define all Events
    ioEvents(io);

    // The server object will be then used to list to a port number
    return server;
};