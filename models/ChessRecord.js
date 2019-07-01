const mongoose = require('mongoose');
const chessRecord = require('./../chessUtils/chessrecord');
const { Schema, Model } = mongoose


class ChessRecordSchema extends mongoose.SchemaType {
    cast() {
        return new chessRecord();
    };
}
mongoose.Schema.Types.ChessRecordSchema = ChessRecordSchema;

const schema = new Schema({
    record: { type: ChessRecordSchema, default: new ChessRecordSchema() },
    room_id: { type: String, required: true }
});

// class ChessRecordClass extends Model {

//     setRecord(record) {
//         this.record = record;
//         return this.save()
//     }

    
// }



// const ChessRecordSchema = new mongoose.Schema({
//     recordKey: { type: String, required: true },
// });
// schema.loadClass(ChessRecordSchema);
const ChessRecord = mongoose.model('ChessRecord', schema);

module.exports = ChessRecord;