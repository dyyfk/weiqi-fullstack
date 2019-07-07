const ChessRecord = require('../models/ChessRecord');
const chessRecord = require('../chessutils/chessrecord');

const initChessEvent = function (io, room_id) {
    io.of('/matchroom').on('connection', socket => {
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

        socket.on('disconnect', () => {
            io.to(room_id).emit('playerDisconnect');
        });
    })
}


module.exports = function (io, room_id) {
    initChessEvent(io, room_id);
};