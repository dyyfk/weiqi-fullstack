const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const db = require('./config/keys').MongoURL;

// MongoDB
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => {
        console.log(`connected to MongoDB`);
    }).catch(err => console.log(err));

// BodyParser
app.use(express.urlencoded({ extended: false }));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


app.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
});