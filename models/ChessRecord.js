const mongoose = require('mongoose');
const chessRecord = require('./../chessUtils/chessrecord');

class ChessRecordSchema extends mongoose.SchemaType {
    cast() {
        return new chessRecord();
    };
}
mongoose.Schema.Types.ChessRecordSchema = ChessRecordSchema;

const schema = new mongoose.Schema({
    record: { type: ChessRecordSchema, default: new ChessRecordSchema() },
    room_id: { type: String, required: true }
})

// const ChessRecordSchema = new mongoose.Schema({
//     recordKey: { type: String, required: true },
// });

const ChessRecord = mongoose.model('ChessRecord', schema);

module.exports = ChessRecord;