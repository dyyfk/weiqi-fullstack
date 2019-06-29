const mongoose = require('mongoose');
const ChessRecord = require('./../chessUtils/chessrecord');

class ChessRecordSchema extends mongoose.SchemaType {
    cast(v) {
        return new ChessRecord(v);
    };
}
mongoose.Schema.Types.Square = SquareSchema

// const ChessRecordSchema = new mongoose.Schema({
//     recordKey: { type: String, required: true },
// });

const ChessRecord = mongoose.model('ChessRecord', ChessRecordSchema);

module.exports = ChessRecord;