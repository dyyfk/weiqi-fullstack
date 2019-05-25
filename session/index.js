const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const db = require('./../config/keys').MongoURL;
const mongoose = require('mongoose');
// const config = require('./../config/keys');

/**
 * Initialize Session
 * Uses MongoDB-based session store
 *
 */

module.exports = (() => {
    return session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        unset: 'destroy',
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
        })
    });
})();