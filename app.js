const express = require('express');
const PORT = process.env.PORT || 3000;
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const db = require('./config/keys').MongoURL;
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
// MongoDB
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => {
        console.log(`connected to MongoDB`);
    }).catch(err => console.log(err));


const app = express();

// Passport config
require('./config/passport-setup')(passport);

// BodyParser
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

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

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


app.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
});