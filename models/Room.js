const mongoose = require('mongoose');

let roomCount = 1;

const RoomSchema = new mongoose.Schema({
    title: { type: String, required: true },
    connections: { type: [{ userId: String, socketId: String }] },
    status: { type: String, default: 'idle', required: true },
    players: { type: [String], default: new Array(2) }
});

RoomSchema.pre('findOneAndUpdate', function (next) {
    if (!this._update.title) {
        this._update.title = `MatchRoom-${roomCount++}`;
    }
    next();
});
const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;