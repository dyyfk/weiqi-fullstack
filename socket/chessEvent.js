const ChessRecord = require('../models/ChessRecord');
const Room = require('../models/Room');

const initChessEvent = function (io, room_id) {
    io.of('/matchroom').on('connection', socket => {
        ChessRecord.findOne({ room_id }).then(room_chessrecord => {
            socket.emit('initChessboard', room_chessrecord.record)
        }).catch(err => console.log(err));


        socket.on('click', chess => {

            ChessRecord.findOne({ room_id }).then(async room_chessrecord => {
                let color = chess.color === "black" ? 1 : -1; // Todo: need to change the data structure

                let promise = room_chessrecord.record.addChess(chess.row, chess.col, color);
                promise.then(chessArr => {
                    io.of('/matchroom').emit('updateChess', chessArr);
                }).catch(err => console.log(err));

                room_chessrecord.markModified('record');
                await room_chessrecord.save();


            }).catch(err => console.log(err));

        });
        socket.on('resignReq', callback => {
            const socket_id = socket.id.replace("/matchroom#", ""); // get rid of the namespace
            Room.findById(room_id).then(room => {
                const opponent = room.connections.filter(user => user.socketId != socket_id)[0];
                io.of("/matchroom").to(`/matchroom#${opponent.socketId}`).emit("opponentResign"); // only emit to matchroom namespace so that audience will not receive it
            }).catch(err => console.log(err));

            callback();
        });

        socket.on("judge", () => {
            ChessRecord.findOne({ room_id }).then(async room_chessrecord => {
                let [blackspaces, whitespaces] = room_chessrecord.record.judge();

                if (blackspaces - whitespaces > 6.5) { // Todo: here black should have some punishment for going first 
                    // socket.emit();
                }
                // promise.then(chessArr => {
                //     io.of('/matchroom').emit('updateChess', chessArr);
                // }).catch(err => console.log(err));



                room_chessrecord.markModified('spaces');
                await room_chessrecord.save();

            }).catch(err => console.log(err));
        })


        socket.on('disconnect', () => {
            // io.to(room_id).emit('playerDisconnect');
            const socket_id = socket.id.replace("/matchroom#", ""); // get rid of the namespace
            Room.findById(room_id).then(room => {
                const user = room.connections.filter(connection => connection.socketId == socket_id)[0];
                const player = room.players.filter(player => player.userId == user.userId)[0];
                player.playerReady = false;
                player.save();
            }).catch(err => console.log(err));

            // Room.findByIdAndUpdate(room_id, {
            //     $set: {
            //         status: 'pause',
            //     }
            // })

        });
    })
}
module.exports = function (io, room_id) {
    initChessEvent(io, room_id);
};