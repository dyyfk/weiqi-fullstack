const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const sessionkey = require('./../config/keys').session.cookieKey;
const mongoose = require('mongoose');

/**
 * Initialize Session
 * Uses MongoDB-based session store
 *
 */

module.exports = (() => {
    return session({
        secret: sessionkey,
        resave: false,
        saveUninitialized: false,
        unset: 'destroy',
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
        })
    });
})();