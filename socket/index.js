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
                    await room.connections.push({ userId: curuser._id, socketId: socket.id });
                    await room.save();
                    await users.push(curuser);
                }


                if (room.players.length > 0) { // that's a match room
                    const players = room.connections.filter(connection => {
                        return connection.userId == (room.players[0]._id || room.players[1]._id);
                    })
                    players.forEach(player => {
                        if (player.socketId == socket.id)
                            io.to(player.socketId).emit('gameBegin', 'self');
                        else
                            io.to(player.socketId).emit('gameBegin', 'other');

                        // This is a bug from Socket.io implementation, you cannot emit event to yourself
                    })
                }

                socket.emit('updateUsersList', users, curuser);
            } catch (e) {
                socket.emit('errors', 'Something went wrong, try again later');
            }
        });
        socket.on('newMessage', (room_id, message) => {
            socket.broadcast.to(room_id).emit('addMessage', message);
        });


        socket.on('disconnect', async () => { // TODO: here

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


    let playerQueue = []; // TODO: This array should come from database

    // This namespace is for queuing, whenenver there are 2 or more players in the queue,
    // two users will be assigned to one idle room's players fields
    io.of('/auto-match-level-1').on('connection', socket => {
        socket.on('join', () => {
            if (!playerQueue.includes(socket.request.session.passport.user))
                playerQueue.push(socket.request.session.passport.user);
        });

        socket.on('matchmaking', async () => {
            if (playerQueue.length >= 2) { // TODO: this should handle larger traffics 
                try {

                    let matchRoom = await Rooo.findOneAndUpdate({ status: 'idle' },
                        { $set: { status: 'playing' } },
                        { "new": true, "upsert": true }).exec();
                    console.log(matchRoom);

                    matchRoom.players[0] = playerQueue[0]; // TODO: code here seems sketchy but works...
                    matchRoom.players[1] = playerQueue[1]; // TODO: code here seems sketchy but works...

                    await matchRoom.save();

                    io.of('/auto-match-level-1').emit('matchReady', matchRoom._id); // TODO: This room is hardcoded for testing


                } catch (e) {
                    socket.emit('errors', 'Something went wrong, try again later');
                }
            }

        });
        socket.on('disconnect', () => {
            playerQueue = playerQueue.filter(player => player !== socket.request.session.passport.user)
        });
        // socket.on('gameBegin');
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