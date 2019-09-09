const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    local: {
        email: String,
        password: String,
    },

    google: {
        id: String,
        thumbnail: String,
        email: String
    },
    name: { type: String, required: true, },
    date: { type: Date, default: Date.now() },
    thumbnail: String,
    email: String,
});

// default parameter
UserSchema.pre('save', function (next) {
    if (this.google.email) {
        this.thumbnail = this.google.thumbnail;
        this.email = this.google.email;
    } else {
        this.thumbnail = 'https://ui-avatars.com/api/?name=' + this.name;
        this.email = this.local.email;
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