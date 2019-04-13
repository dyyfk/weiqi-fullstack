const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use('/', require('./routes/index'));

app.use('/user', require('./routes/user'));


app.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
});