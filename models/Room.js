const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    title: { type: String, required: true },
    connections: { type: [{ userId: String }] },
    status: { type: String, default: 'empty', required: true },
    players: { type: [{ userId: String }] }
});
const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;