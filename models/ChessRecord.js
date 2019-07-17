const mongoose = require('mongoose');
const chessRecord = require('../chessUtils/chessrecord');
const { Schema, Model } = mongoose


class ChessRecordSchema extends mongoose.SchemaType {
    cast(val) {
        if (val.record) {
            return new chessRecord(val);
        }
        return new chessRecord();
    };
}
mongoose.Schema.Types.ChessRecordSchema = ChessRecordSchema;

const schema = new Schema({
    record: { type: ChessRecordSchema, default: new ChessRecordSchema() },
    room_id: { type: String, required: true }
});

const ChessRecord = mongoose.model('ChessRecord', schema);

module.exports = ChessRecord;