const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    title: { type: String, required: true },
    connections: { type: [{ userId: String, socketId: String }] },
    status: { type: String, default: 'idle', required: true },
    players: { type: [{ userId: String }] }
});
const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;