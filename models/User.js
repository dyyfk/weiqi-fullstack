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
    googleId: {
        type: String,
        required: false
    },

    thumbnail: {
        type: String,
        required: false,
        default: 'https://ui-avatars.com/api/?name=' + this.name
    }
});

// UserSchema.pre('save', (next) => {
//     this.thumbnail = 'https://ui-avatars.com/api/?name=' + this.name;

//     next();
// });


const User = mongoose.model('User', UserSchema);

module.exports = User;