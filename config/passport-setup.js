const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');

const User = require('../models/User');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            User.findOne({ 'local.email': email }).then(user => {
                if (!user) {
                    return done(null, false, { message: 'That email is not registered' });
                } else {
                    bcrypt.compare(password, user.local.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Password incorrect' });
                        }
                    });
                }
            }).catch(err => console.log(err));
        })
    );

    passport.use(
        new GoogleStrategy({
            // options for google strategy
            clientID: keys.google.clientID,
            clientSecret: keys.google.clientSecret,
            callbackURL: '/users/login/google/redirect'
        }, (accessToken, refreshToken, profile, done) => {
            // check if user already exists in our own db
            User.findOne({ 'google.id': profile.id }).then((currentUser) => {
                if (currentUser) {
                    // already have this user
                    done(null, currentUser);
                } else {
                    // if not, create user in our db
                    new User({
                        'google.id': profile.id,
                        'name': profile.displayName,
                        'google.thumbnail': profile._json.picture
                    }).save().then((newUser) => {
                        done(null, newUser);
                    });
                }
            });
        })
    );

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};