const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    title: { type: String, required: true },
    connections: { type: [{ userId: String, socketId: String }] },
    status: { type: String, default: "idle", required: true },
    players: {
        type: [{
            userId: String, socketId: String, color: Number, playerReady: Boolean
        }], default: new Array(2)
    },
    // playerReady: { type: Number, default: 0 }
});

RoomSchema.pre('findOneAndUpdate', function (next) {
    if (!this._update.title) {
        this._update.title = `MatchRoom-${(+new Date).toString(36)}`;
    }
    next();
});
const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;