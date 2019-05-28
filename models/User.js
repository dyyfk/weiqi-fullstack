const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now()
    },
    googleId: {
        type: String,
        default: null
    },

    thumbnail: {
        type: String,
        default: null
    }
});

 UserSchema.pre('save', function (next) {
     this.thumbnail = 'https://ui-avatars.com/api/?name=' + this.name;
     next();
 });


const User = mongoose.model('User', UserSchema);

module.exports = User;