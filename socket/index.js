const Room = require('../models/Room');
const User = require('../models/User');

const ioEvents = function (io) {

    io.on('connection', socket => {
        socket.on('join', async room_id => {
            try {
                const room = await Room.findById(room_id);
                const curuser = await User.findById(socket.request.session.passport.user, '-local.password');

                socket.join(room_id);

                let hasJoined = false;
                const users = await Promise.all(room.connections.map(async connection => {
                    if (connection.userId == curuser._id) {
                        hasJoined = true;
                        return curuser;
                    }
                    return User.findById(connection.userId, '-local.password').then(user => {
                        return user;
                    })
                }));


                if (!hasJoined) {
                    await room.connections.push({ userId: curuser._id });
                    await room.save();
                    await users.push(curuser);
                }

                socket.emit('updateUsersList', users, curuser);
            } catch (e) {
                socket.emit('errors', 'Something went wrong, try again later');
            }
        });
        socket.on('newMessage', (room_id, message) => {
            socket.broadcast.to(room_id).emit('addMessage', message);
        });

        socket.on('disconnect', async () => {

            try {
                const userId = socket.request.session.passport.user;
                await Room.find({
                    "connections.userId": { $in: [userId] }
                }, (err, rooms) => {
                    rooms.forEach(async room => {
                        room.connections
                            = await room.connections.filter(connection => connection.userId != userId);
                        await room.save();
                    });
                });
            } catch (e) {
                socket.emit('errors', 'Something went wrong, try again later');
                // Todo: This should become a specific method on the client side
            }
            console.log('Connection lost');
        });
    });


    const playerQueue = []; // TODO: This array should come from database

    io.of('/auto-match-level-1').on('connection', socket => {
        socket.on('join', () => {
            playerQueue.push(socket.request.session.passport.user);
        });

        socket.on('matchmaking', () => {
            if (playerQueue.length == 2) { // TODO: this should handle larger traffics 
                io.of('/auto-match-level-1').emit('matchReady', '5cf1e768cb7c3f344c99fb83'); // TODO: This room is hardcoded for testing
            }

            

            // const curuser = await User.findById(userId, '-local.password');

            // console.log(Object.keys(io.of('/automatch/level-1').sockets.sockets));
            // console.log(userId);
            // User.findById({ user_id }).then(user => {
            //     console.log(user);
            // });
        });
    });


};

module.exports = function (app) {

    const server = require('http').Server(app);
    const io = require('socket.io')(server);

    // Force Socket.io to ONLY use "websockets"; No Long Polling.
    // io.set('transports', ['websocket']);

    io.use((socket, next) => {
        require('../session')(socket.request, socket.request.res || {}, next);
    });
    // Define all Events
    ioEvents(io);

    // The server object will be then used to list to a port number
    return server;
};