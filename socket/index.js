const Room = require('../models/Room');
const User = require('../models/User');
const { getUsers, addUser, removeUser } = require('../models/RoomHelper');

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

                ``
                if (!hasJoined) {
                    room.connections.push({ userId: curuser._id });
                    await room.save();
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
                    "connections.userId": { $in: [userId    ] }
                }, (err, res) => {
                    console.log(res);
                })
            } catch (e) {
                socket.emit('errors', { error: 'Something went wrong, try again later' });
                // Todo: This should become a specific method on the client side
            }

            // if (socket.request.session.passport == null) {
            //     return;
            // }
            // removeUser(socket, function (err, room, userId, cuntUserInRoom) {
            //     if (err) throw err;

            //     // Leave the room channel
            //     socket.leave(room.id);

            //     // Return the user id ONLY if the user was connected to the current room using one socket
            //     // The user id will be then used to remove the user from users list on chatroom page
            //     if (cuntUserInRoom === 1) {
            //         socket.broadcast.to(room.id).emit('removeUser', userId);
            //     }
            // });

            console.log('Connection lost');
        });
    });




    io.of('/automatch/level-1').on('connection', socket => {

        socket.on('matchmaking', (user_id) => {
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