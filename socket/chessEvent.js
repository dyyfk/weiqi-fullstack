initChessEvent = function (io, chessRecords) {
    io.on('connection', function (socket) {
        socket.on('click', (chess, fn) => {
            let record = chessRecords[0];

            let color = chess.color === "black" ? 1 : -1; // Todo: need to change the data structure

            let promise = record.addChess(chess.row, chess.col, color);
            promise.then(chess => {
                fn(chess);
            }).catch(err => console.log(err))
        })
    })
}


module.exports = function (io, chessRecords) {
    initChessEvent(io, chessRecords);
};