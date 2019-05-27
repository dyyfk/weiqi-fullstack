const User = require('../models/User');
const Room = require('../models/Room');

const find = function (data, callback) {
    Room.find(data).then(callback);
};

const getUsers = function (room, socket, callback) {

    let users = [], vis = {}, cunt = 0;
    let userId = socket.request.session.passport.user;
    // Loop on room's connections, Then:
    room.connections.forEach(function (conn) {

        // 1. Count the number of connections of the current user(using one or more sockets) to the passed room.
        if (conn.userId === userId) {
            cunt++;
        }

        // 2. Create an array(i.e. users) contains unique users' ids

        if (!vis[conn.userId]) {
            users.push(conn.userId);
        }
        vis[conn.userId] = true;
    });

    // Loop on each user id, Then:
    // Get the user object by id, and assign it to users array.
    // So, users array will hold users' objects instead of ids.
    let loadedUsers = 0;
    users.forEach(function (userId, i) {
        User.findById(userId, function (err, user) {
            if (err) { return callback(err); }
            users[i] = user;

            // fire callback when all users are loaded (async) from database 
            if (++loadedUsers === users.length) {
                return callback(null, users, cunt);
            }
        });
    });
};

const addUser = function (room, socket, callback) {

    // Get current user's id
    let userId = socket.request.session.passport.user;

    // Push a new connection object(i.e. {userId + socketId})
    let conn = { userId: userId, socketId: socket.id };
    room.connections.push(conn);
    room.save(callback);
};

const removeUser = function (socket, callback) {

    // Get current user's id
    let userId = socket.request.session.passport.user;

    find(function (err, rooms) {
        if (err) { return callback(err); }

        // Loop on each room, Then:
        rooms.every(function (room) {
            let pass = true, cunt = 0, target = 0;

            // For every room, 
            // 1. Count the number of connections of the current user(using one or more sockets).
            room.connections.forEach(function (conn, i) {
                if (conn.userId === userId) {
                    cunt++;
                }
                if (conn.socketId === socket.id) {
                    pass = false, target = i;
                }
            });

            // 2. Check if the current room has the disconnected socket, 
            // If so, then, remove the current connection object, and terminate the loop.
            if (!pass) {
                room.connections.id(room.connections[target]._id).remove();
                room.save(function (err) {
                    callback(err, room, userId, cunt);
                });
            }

            return pass;
        });
    });
};


module.exports = {
    getUsers,
    addUser,
    removeUser
};