const mongoose = require('mongoose');

const GoogleUserSchema = new mongoose.Schema({
    username: String,
    googleId: String,
    thumbnail: String
});

const GoogleUser = mongoose.model('GoogleUser', GoogleUserSchema);

module.exports = GoogleUser;