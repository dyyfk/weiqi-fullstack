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
//        type: String,
    },

    thumbnail: {
        type: String,
    }
});

 UserSchema.pre('save', function (next) {
     this.thumbnail = 'https://ui-avatars.com/api/?name=' + this.name;
     next();	
 });

UserSchema.pre('validate',function(next){
	

	next();
});


const User = mongoose.model('User', UserSchema);

module.exports = User;