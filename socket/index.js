const Room = require('../models/Room');
const User = require('../models/User');
const ChessRecord = require('../models/ChessRecord');


let playerQueue = []; // TODO: This array should come from database

const ioEvents = function (io) {

    io.on('connection', socket => {
        socket.on('join', async (room_id, callback) => {
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
                if (room.players.length > 0 && room.players.some(player => player.userId == curuser._id)) { // that's a match room
                    let currentPlayer = room.players.filter(player => player.userId == curuser._id)[0]; // Todo: here should check for socket id\
                    if (!currentPlayer.playerReady) {
                        require('./chessEvent.js')(io, room_id); // initialize chess event
                        currentPlayer.playerReady = true;
                        await room.save();
                    }

                    let playersInfo = [];



                    for (let player of room.players) {
                        let playerInfo = await User.findById(player.userId).select("name email thumbnail");
                        let a = Object.isFrozen(playerInfo)
                        let b = Object.seal(playerInfo);
                        console.log(a, b);

                        // playerInfo.color = await "black"
                        // await change(playerInfo);
                        // const func = playerInfo => {
                        //     playerInfo.color = "black";
                        //     return Promise.resolve(playerInfo);
                        // }
                        // playerInfo = func(playerInfo);
                        // let copy = Object.assign({}, playerInfo, { b: 22 })
                        await playersInfo.push(playerInfo);
                    }


                    console.log(playersInfo);



                    // await Promise.all(room.players.map(player => {
                    //     let playerInfo = User.findById(player.userId).select("name email thumbnail");
                    //     let a = Object.isFrozen(playerInfo)
                    //     let b = Object.seal(playerInfo);


                    //     // let copy = await Object.assign({}, playerInfo, { b: 22 })

                    //     // playerInfo["color"] = await "black";
                    //     // console.log(copy);

                    //     return playerInfo

                    // })).then(console.log(playersInfo));




                    ChessRecord.findOne({ room_id }).then(record => {
                        if (record) {
                            console.log('A chessrecord has already been created');
                        } else {
                            const newChessRecord = new ChessRecord({ room_id });
                            newChessRecord.save();
                        }
                    }).catch(err => console.log(err));

                    let color = currentPlayer.color === 1 ? "black" : "white";
                    console.log(color);
                    callback(color); // Match room, callback with color
                    io.in(room_id).emit('updatePlayersList', playersInfo);

                } else {
                    callback(); // Normal room, callback with null value
                }


                io.in(room_id).emit('updateUsersList', users, curuser);

            } catch (e) {
                console.log(e);
                socket.emit('errors', e);
            }
        });




        socket.on('newMessage', (room_id, message) => {
            socket.broadcast.to(room_id).emit('addMessage', message);
        });


        socket.on('disconnect', async (e) => {

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
                        // player = room.players.filter(player => player.userId == userId)[0]; // The user is a player in this room
                        // if (player) {
                        //     player.playerReady = false;
                        // }
                        await room.save();

                        let userInRoom = [];

                        for (let connection of room.connections) {
                            let user = await User.findById(connection.userId).select("name email thumbnail");
                            await userInRoom.push(user);
                        }



                        io.in(room._id).emit("updateUsersList", userInRoom);

                        if (room.connections.length == 0) {

                            // Todo: here should change the status to empty
                            // setTimeout(() => room.remove(), 300000) // Empty room will be removed in 300 seconds
                        }
                    });

                });

            } catch (e) {
                console.log(e);
                socket.emit('errors', e);
                // Todo: This should become a specific method on the client side
            }
            console.log('Connection lost', e);
        });

        socket.on('matchmaking', async () => {
            if (!playerQueue.includes(socket.request.session.passport.user))
                playerQueue.push({ userId: socket.request.session.passport.user, socket });

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
                                    color: 1
                                }, {
                                    playerReady: false,
                                    userId: playerQueue[1].userId,
                                    color: -1
                                }]
                            }
                        }, {
                            "new": true,
                            upsert: true
                        }).exec();

                    playerQueue.forEach(player => {
                        player.socket.emit('matchReady', matchRoom._id);
                    })
                    playerQueue = playerQueue.splice(0, 2);

                } catch (e) {
                    console.log(e);

                    socket.emit('errors', e);
                }
            }
        });


        // This namespace is for queuing, whenenver there are 2 or more players in the queue,
        // two users will be assigned to one idle room's players fields
        // io.of('/auto-match-level-1').on('connection', socket => {
        //     // socket.on('join', () => {

        //     // });
        // });
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
        'pingInterval': 10000, // how many ms before sending a new ping packet
        'pingTimeout': 5000, // how many ms without a pong packet to consider the connection close
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