const ChessRecord = require('../models/ChessRecord');
const Room = require('../models/Room');

const initChessEvent = function (io, room_id, socketId) {

    const gameEndInRoom = async (room, result) => {
        room.status = result;
        await room.save();
    }

    io.of('/matchroom').on('connection', socket => {
        const socket_id = socket.id.replace("/matchroom#", ""); // get rid of the namespace
        if (socket_id != socketId) return; // this socket's event has already been initialized

        socket.join(room_id); // Join the room in matchroom namespace
        socket.to(room_id).emit("opponentConnected"); // only emit to matchroom namespace so that audience will not receive it
        socket.emit("playerConnected");

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


        socket.on('resignReq', (color, callback) => {
            Room.findById(room_id).then(room => {
                let opponent = room.connections.filter(user => user.socketId != socket_id)[0];

                io.of("/matchroom").to(`/matchroom#${opponent.socketId}`).emit("opponentResign");
                // only emit to matchroom namespace so that audience will not receive it
                gameEndInRoom(room, `${color} resigns`);

            }).catch(err => console.log(err));

            callback();
        });

        socket.on('opponentTimeout', color => {
            Room.findById(room_id).then(room => {
                gameEndInRoom(room, `${color} wins, opponent times out`);
            }).catch(err => console.log(err));
        });

        socket.on('exitDeathStoneMode', () => {
            io.of("/matchroom").to(room_id).emit('exitJudgePhase');
        })


        socket.on("judgeReqAnswer", answer => {

            if (answer) {
                io.of("/matchroom").to(room_id).emit('judgePhase');
            } else {
                socket.to(room_id).emit('judgeReqDeclined');
            }


        });


        socket.on("judgeReq", () => {
            socket.to(room_id).emit("opponentJudgeReq");
        });


        socket.on("deathStoneSelected", chessArr => {
            socket.to(room_id).emit("opponentDeathStone", chessArr);
        });

        socket.on('deathStoneConsensusReq', () => {
            socket.to(room_id).emit("deathStoneConsensusReq");
        })

        socket.on('deathStoneConsensusDeclined', () => {
            socket.to(room_id).emit("deathStoneConsensusDeclined");
        })




        socket.on("deathStoneFinished", cleanedChessboard => {
            ChessRecord.findOne({ room_id }).then(async room_chessrecord => {
                room_chessrecord.record.cleanedChessboard = cleanedChessboard;
                room_chessrecord.markModified('record');
                await room_chessrecord.save();

                let [blackspaces, whitespaces] = room_chessrecord.record.judge();

                if (blackspaces - whitespaces > 0) { // Todo: here should have the penalty for Chinese rules
                    io.in(room_id).emit("blackWin", blackspaces, whitespaces);
                    Room.findById(room_id).then(room => {
                        gameEndInRoom(room, `Black wins by ${blackspaces - whitespaces}`);
                    }).catch(err => console.log(err))
                } else {
                    io.in(room_id).emit("whiteWin", blackspaces, whitespaces);
                    Room.findById(room_id).then(room => {
                        gameEndInRoom(room, `White wins by ${whitespaces - blackspaces}`);
                    }).catch(err => console.log(err))
                }




            }).catch(err => console.log(err));

        });


        socket.on('disconnect', () => {
            socket.to(room_id).emit("opponentLeft"); // only emit to matchroom namespace so that audience will not receive it


            // io.to(room_id).emit('playerDisconnect');
            Room.findById(room_id).then(room => {
                const user = room.connections.filter(connection => connection.socketId == socket_id)[0];

                let player = room.players.filter(player => player.userId == user.userId)[0];
                player.playerReady = false;
                room.save();

                // const user = room.connections.filter(connection => connection.socketId == socket_id)[0];
                // const opponent = room.players.filter(player => player.userId != user.userId)[0];
                // const opponentSocketId = room.connections.filter(connection => connection.userId == opponent.userId)[0].socketId;

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