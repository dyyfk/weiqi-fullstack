const ChessRecord = require('../models/ChessRecord');
const Room = require('../models/Room');

// var { Timer } = require('./easytimer.min.js');
// let whiteTimer = new Timer();
// let blackTimer = new Timer();
// blackTimer.start({ countdown: true, startValues: { seconds: 60 * 60 * 2 } });
// whiteTimer.start({ countdown: true, startValues: { seconds: 60 * 60 * 2 } });
// whiteTimer.pause();

const initChessEvent = function (io, room_id, socketId) {

    const gameEndInRoom = async room => {
        room.players = []; // this room is no longer a matchroom 
        room.status = "end";
        await room.save();
    }

    io.of('/matchroom').on('connection', socket => {
        const socket_id = socket.id.replace("/matchroom#", ""); // get rid of the namespace
        if (socket_id != socketId) return; // this socket's event has already been initialized



        ChessRecord.findOne({ room_id }).then(room_chessrecord => {
            socket.emit('initChessboard', room_chessrecord.record);
            // An empty chessrecord will be sent to the chessroom to indicate the game has begun
        }).catch(err => console.log(err));

        socket.on('click', async (chess, callback) => {
            try {
                let room_chessrecord = await ChessRecord.findOne({ room_id });
                let color = chess.color === "black" ? 1 : -1; // Todo: need to change the data structure
                let promise = room_chessrecord.record.addChess(chess.row, chess.col, color);
                await promise.then(chessArr => {
                    io.in(room_id).emit('updateChess', chessArr, chess); // Emit to the game room
                    callback();
                }).catch(err => {
                    callback(err);
                });

                room_chessrecord.markModified('record');
                await room_chessrecord.save();

            } catch (error) {
                console.log(error)
            }
        });


        socket.on('resignReq', callback => {
            Room.findById(room_id).then(room => {
                const opponent = room.connections.filter(user => user.socketId != socket_id)[0];
                io.of("/matchroom").to(`/matchroom#${opponent.socketId}`).emit("opponentResign");
                // only emit to matchroom namespace so that audience will not receive it
                gameEndInRoom(room);

            }).catch(err => console.log(err));

            callback();
        });

        // socket.on("judge", () => {
        //     ChessRecord.findOne({ room_id }).then(async room_chessrecord => {
        //         let [blackspaces, whitespaces] = room_chessrecord.record.judge();

        //         if (blackspaces - whitespaces > 6.5) { // Todo: here black should have some punishment for going first 
        //             // socket.emit();
        //         }
        //         // promise.then(chessArr => {
        //         //     io.of('/matchroom').emit('updateChess', chessArr);
        //         // }).catch(err => console.log(err));


        //         room_chessrecord.markModified('record');
        //         await room_chessrecord.save();

        //     }).catch(err => console.log(err));
        // })


        socket.on("deathStoneFinished", cleanedChessboard => {
            ChessRecord.findOne({ room_id }).then(async room_chessrecord => {
                room_chessrecord.record.cleanedChessboard = cleanedChessboard;
                room_chessrecord.markModified('record');
                await room_chessrecord.save();

                let [blackspaces, whitespaces] = room_chessrecord.record.judge();

                if (blackspaces - whitespaces > 6.5) { // The penalty for Chinese rules
                    io.in(room_id).emit("blackWin", blackspaces, whitespaces);
                    // console.log(io.in(room_id));
                } else {
                    io.in(room_id).emit("whiteWin", blackspaces, whitespaces);
                    // console.log(io.in(room_id));
                }

                Room.findById(room_id).then(room => {
                    // gameEndInRoom(room);
                }).catch(err => console.log(err))

            }).catch(err => console.log(err));

        });


        socket.on('disconnect', () => {
            // io.to(room_id).emit('playerDisconnect');
            Room.findById(room_id).then(room => {
                const player = room.players.filter(player => player.userId == user.userId)[0];
                player.playerReady = false;
                room.save();

                const user = room.connections.filter(connection => connection.socketId == socket_id)[0];
                const opponent = room.players.filter(player => player.userId != user.userId)[0];
                const opponentSocketId = room.connections.filter(connection => connection.userId == opponent.userId)[0].socketId;



                // console.log(opponentSocketId);

                io.of("/matchroom").to(`/matchroom#${opponentSocketId}`).emit("opponentLeft"); // only emit to matchroom namespace so that audience will not receive it


            }).catch(err => console.log(err));

            // Room.findByIdAndUpdate(room_id, {
            //     $set: {
            //         status: 'pause',
            //     }
            // })

        });
    })
}
module.exports = function (io, room_id, socketId) {
    initChessEvent(io, room_id, socketId);
};