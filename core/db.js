const settings = require('../settings');
const mongoose = require('mongoose');
const connectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.connect(settings.db_url, connectOptions)
    .then(() => console.log('Mongo database connected'))
    .catch(() => console.log('ERROR: Mongo database not connected'));


