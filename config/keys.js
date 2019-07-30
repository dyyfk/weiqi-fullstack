module.exports = {
    MongoURL: process.env.MONGODB_URI || 'mongodb://localhost:27017/Passport_ex',
    google: {
        clientID: '104440440343-lq8aefb5iq5p6v96q41o9tnd5ld314f9.apps.googleusercontent.com',
        clientSecret: '8dSoyB5e2jL7B1nZUEtA5Nn2'
    },
    session: {
        cookieKey: 'uwmgoSession'
    }
};