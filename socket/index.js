const Room = require('../models/Room');
const User = require('../models/User');
const ChessRecord = require('../models/ChessRecord');

const ioEvents = function (io) {

    io.on('connection', socket => {
        socket.on('join', async room_id => {
            try {
                const room = await Room.findById(room_id);
                const curuser = await User.findById(socket.request.session.passport.user).select("name email thumbnail");

                socket.join(room_id);

                let hasJoined = false;
                const users = await Promise.all(room.connections.map(async connection => {
                    if (connection.userId == curuser._id) {
                        hasJoined = true;
                        return curuser;
                    }
                    return User.findById(connection.userId).select("name email thumbnail").then(user => {
                        return user;
                    })
                }));
                if (!hasJoined) {
                    await room.connections.push({
                        userId: curuser._id,
                        socketId: socket.id
                    });
                    await room.save();
                    await users.push(curuser);
                }

                // let count = 0
                // console.log(room.playerReady, "before");

                if (room.players.length > 0) { // that's a match room
                    // const currentUser = room.connections.filter(connection => connection.socketId == socket.id)[0];
                    const currentPlayer = room.players.filter(player => player.socketId == player.socketId)[0]; // Todo: here should check for socket id\
                    if (!currentPlayer.playerReady) {
                        require('./chessEvent.js')(io, room_id); // initialize chess event
                        currentPlayer.playerReady = true;
                        room.save();
                    }


                    ChessRecord.findOne({ room_id }).then(record => {
                        if (record) {
                            console.log('A chessrecord has already been created');
                        } else {
                            const newChessRecord = new ChessRecord({ room_id });
                            newChessRecord.save();
                        }

                    }).catch(err => console.log(err));
                    let players = room.connections.filter(connection => {
                        return connection.userId == room.players[0].userId || connection.userId == room.players[1].userId;
                    });

                    let counter = 0;
                    players.forEach(player => {
                        io.to(`${player.socketId}`).emit('gameBegin', counter++ == 1 ? 'white' : 'black');
                    });

                    // room.playerReady = room.playerReady + 1;
                    // room.save();
                    // console.log(room.playerReady, "after");

                }

                socket.emit('updateUsersList', users, curuser);
            } catch (e) {
                console.log(e);

                socket.emit('errors', e);
            }
        });




        socket.on('newMessage', (room_id, message) => {
            socket.broadcast.to(room_id).emit('addMessage', message);
        });


        socket.on('disconnect', async () => {

            try {
                const userId = socket.request.session.passport.user;
                await Room.find({
                    "connections.userId": {
                        $in: [userId]
                    }
                }, (err, rooms) => {
                    if (err) console.log(err);
                    rooms.forEach(async room => {
                        room.connections = await room.connections.filter(connection => connection.userId != userId);
                        await room.save();
                        if (room.connections.length == 0) {

                            // TOdo: here should change the status to empty
                            // setTimeout(() => room.remove(), 300000) // Empty room will be removed in 300 seconds
                        }
                    });

                });

            } catch (e) {
                console.log(e);
                socket.emit('errors', e);
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
                playerQueue.push({ userId: socket.request.session.passport.user, socketId: (socket.id).replace("/auto-match-level-1#", "") });
        });

        socket.on('matchmaking', async () => {
            if (playerQueue.length >= 2) { // TODO: this should handle larger traffics 
                try {

                    let matchRoom = await Room.findOneAndUpdate({
                        status: 'idle'
                    }, {
                            $set: {
                                status: 'playing', // Todo: here should not update the status yet
                                'players': [{
                                    playerReady: false,
                                    userId: playerQueue[0].userId,
                                    socketId: playerQueue[0].socketId,
                                    color: 1
                                }, {
                                    playerReady: false,
                                    userId: playerQueue[1].userId,
                                    socketId: playerQueue[1].socketId,
                                    color: -1
                                }]
                            }
                        }, {
                            "new": true,
                            upsert: true
                        }).exec();

                    playerQueue = playerQueue.splice(0, 2);

                    io.of('/auto-match-level-1').emit('matchReady', matchRoom._id);


                } catch (e) {
                    console.log(e);

                    socket.emit('errors', e);
                }
            }

        });
    });


    //     socket.on('stopMatchMaking', () => {
    //         playerQueue = playerQueue.splice(0, 1); // TODO: this one has problem as it should remove the socket use instead of always remove the first element
    //     })


    /*
 
    THIS CODE IS COPIED AND I HAVEN'T added a function
    
 
    */
    // socket.on('disconnect', async () => {
    //     try {
    //         const userId = socket.request.session.passport.user;
    //         await Room.find({
    //             "connections.userId": { $in: [userId] }
    //         }, (err, rooms) => {
    //             rooms.forEach(async room => {
    //                 room.connections
    //                     = await room.connections.filter(connection => connection.userId != userId);
    //                 await room.save();
    //             });
    //         });
    //     } catch (e) {
    //         socket.emit('errors', 'Something went wrong, try again later');
    //         // Todo: This should become a specific method on the client side
    //     }
    //     console.log('Connection lost');
    // });
    // socket.on('gameBegin');


};

module.exports = function (app) {

    const server = require('http').Server(app);
    const io = require('socket.io')(server, {
        pingInterval: 10000, // how many ms before sending a new ping packet
        pingTimeout: 5000, // how many ms without a pong packet to consider the connection closed
    });

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