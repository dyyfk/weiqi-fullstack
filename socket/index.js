const Room = require('../models/Room');
const User = require('../models/User');
const { getUsers, addUser, removeUser } = require('../models/RoomHelper');

const ioEvents = function (io) {

    io.on('connection', socket => {
        console.log(Object.keys(io.sockets.sockets));
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



    io.of('/automatch/level-1').on('connection', socket => {
        socket.on('matchmaking', async () => {
            socket.join('matchmaking');
            const userId = socket.request.session.passport.user;
            const curuser = await User.findById(userId, '-local.password');
            // const clients = Object.keys(io.sockets.sockets);
            if (clients.length === 2) {
                console.log('ready to match');
            }
            // console.log('io: ' + clinets);
            // console.log(Object.keys(io.of('matchmaking').sockets.sockets));
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