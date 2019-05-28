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
        required: false,
    },
    date: {
        type: Date,
        default: Date.now()
    },
    google: {
        id: String,
        thumbnail: String
    },

    thumbnail: String,
});

// default avatar
UserSchema.pre('save', function (next) {
    if (this.google.thumbnail) {
        this.thumbnail = this.google.thumbnail;
    } else {
        this.thumbnail = 'https://ui-avatars.com/api/?name=' + this.name;
    }
    next();
});

UserSchema.pre('validate', function (next) {


    next();
});


const User = mongoose.model('User', UserSchema);

module.exports = User;