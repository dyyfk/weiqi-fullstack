const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    local: {
        email: String,
        password: String,
    },

    google: {
        id: String,
        thumbnail: String
    },

    name: { type: String, required: true, },
    date: { type: Date, default: Date.now() },
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

// UserSchema.pre('validate', function (next) {
//     let hasProvider = this.google || this.local;
//     if (hasProvider) next();
//     else next(new Error('No Provider provided'));
//     // TODO: this will terminate the server
// });


const User = mongoose.model('User', UserSchema);

module.exports = User;