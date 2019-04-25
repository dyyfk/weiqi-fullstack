let ioEvents = function (io) {


    io.on('connection', (socket) => {
        socket.on('sendMessage', () => {
            console.log('server received message');
        });
    });

    io.of('/rooms').on('connection', function (socket) {
        console.log('users joined');
        // Create a new room
        // socket.on('createRoom', function (title) {
        //     Room.findOne({ 'title': new RegExp('^' + title + '$', 'i') }, function (err, room) {
        //         if (err) throw err;
        //         if (room) {
        //             socket.emit('updateRoomsList', { error: 'Room title already exists.' });
        //         } else {
        //             Room.create({
        //                 title: title
        //             }, function (err, newRoom) {
        //                 if (err) throw err;
        //                 socket.emit('updateRoomsList', newRoom);
        //                 socket.broadcast.emit('updateRoomsList', newRoom);
        //             });
        //         }
        //     });
        // });
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