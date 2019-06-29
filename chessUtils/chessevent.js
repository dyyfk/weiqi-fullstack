const ChessRecord = require('../chessUtils/chessrecord');

module.exports = class ChessEvent {
    constructor(socket) {
        this.socket = socket;
        this.chessRecord = new ChessRecord();
    }

    onClick(chess) {
        // var x = chess.x;
        // var y = chess.y;
        // chessObj.color = color;
        // var user = users.getUser(socket.id);
        // var chessRecord;

        // if (user) {
        //     var room = user.room;
        //     chessRecord = chessRecords.getRoomRecord(room);
        //     var err = chessRecord.addChess(x, y, color);
        //     if (err) {
        //         return Promise.reject(err);
        //     }
        //     chessRecord = chessRecords.getRoomRecord(room);
        //     socket.to(room).emit('updateChess', chessRecord); //TODO: update the chess to the other user
        // }

        // callback(undefined, chessRecord);
    }


}