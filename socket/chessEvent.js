const ChessRecord = require('../models/ChessRecord');
const chessRecord = require('../chessUtils/chessrecord');

// castToMongoose = async (room_chessrecord, record) => {
//     room_chessrecord.chessArr = record.chessArr
//     room_chessrecord.nextRound = record.nextRound
//     room_chessrecord.record = record.record;
//     room_chessrecord.joinedChess = record.joinedChess;
//     room_chessrecord.ko = record.ko;
//     await room_chessrecord.save();
//     console.log(room_chessrecord);
//     return room_chessrecord;
// }

// castToJs = (room_chessrecord, record) => {
//     let record = new chessRecord();
//     record.chessArr = room_chessrecord.chessArr;
//     record.nextRound = room_chessrecord.nextRound;
//     record.record = room_chessrecord.record;
//     record.joinedChess = room_chessrecord.joinedChess;
//     record.ko = room_chessrecord.ko;
//     return record;
// }


initChessEvent = function (io, room_id) {
    io.of('/matchroom').on('connection', async socket => {
        const room_record = await ChessRecord.findOne({ room_id });

        const room_chessrecord = room_record.record;

        let newRecord = Object.assign(room_chessrecord, new chessRecord());
        console.log(newRecord)

        try {
            socket.on('click', (chess, fn) => {
                let color = chess.color === "black" ? 1 : -1; // Todo: need to change the data structure

                let promise = newRecord.addChess(chess.row, chess.col, color);
                promise.then(chessArr => {
                    io.of('/matchroom').emit('updateChess', chessArr);
                    await newRecord.save();
                }).catch(err => console.log(err));
            });
        } catch (e) {
            console.log(e);
            socket.emit('errors', 'Something went wrong, try again later');
        }

    })
}


module.exports = function (io, room_id) {
    initChessEvent(io, room_id);
};