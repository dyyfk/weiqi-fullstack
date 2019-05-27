const Room = require('../models/Room');
const User = require('../models/User');
const { getUsers, addUser, removeUser } = require('../models/RoomHelper');

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
                    addUser(room, socket, function (err, newRoom) {

                        // Join the room channel
                        socket.join(newRoom.id);

                        getUsers(newRoom, socket, function (err, users, cuntUserInRoom) {
                            if (err) throw err;

                            // Return list of all user connected to the room to the current user
                            socket.emit('updateUsersList', users, true);

                            // Return the current user to other connecting sockets in the room 
                            // ONLY if the user wasn't connected already to the current room
                            if (cuntUserInRoom === 1) {
                                socket.broadcast.to(newRoom.id).emit('updateUsersList', users[users.length - 1]);
                            }
                        });
                    });

                }
            });
        });
        socket.on('sendMeg', (message) => {

        });

        socket.on('disconnect', function () {
            if (socket.request.session.passport == null) {
                return;
            }
            removeUser(socket, function (err, room, userId, cuntUserInRoom) {
                if (err) throw err;

                // Leave the room channel
                socket.leave(room.id);

                // Return the user id ONLY if the user was connected to the current room using one socket
                // The user id will be then used to remove the user from users list on chatroom page
                if (cuntUserInRoom === 1) {
                    socket.broadcast.to(room.id).emit('removeUser', userId);
                }
            });

            // console.log('Connection lost');
        });
    });




};

module.exports = function (app) {

    const server = require('http').Server(app);
    const io = require('socket.io')(server);

    io.use((socket, next) => {
        require('../session')(socket.request, socket.request.res || {}, next);
    });
    // Define all Events
    ioEvents(io);

    // The server object will be then used to list to a port number
    return server;
};