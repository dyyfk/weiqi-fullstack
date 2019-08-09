const express = require('express');
const PORT = process.env.PORT || 3000;
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const db = require('./config/keys').MongoURL;
const flash = require('connect-flash');
const passport = require('passport');
const keys = require('./config/keys');

const app = express();
const ioServer = require('./socket')(app);


// MongoDB
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => {
        console.log(`connected to MongoDB`);
    }).catch(err => console.log(err));

// Passport config
require('./config/passport-setup')(passport);

// public file
app.use(express.static('public'));

// BodyParser
app.use(express.urlencoded({ extended: false }));

// Session Store
app.use(require('./session'));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Flash message
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Disable the cache
app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/lobby', require('./routes/lobby'));
app.use('/rooms', require('./routes/room'));


// 404
app.use((req, res, next) => {
    res.status(404).render('error');
});


ioServer.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
});