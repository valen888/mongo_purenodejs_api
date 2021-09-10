module.exports = {};

const mongoose = require('mongoose');
const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const uri = 'mongodb://localhost:27017';
mongoose.connect(uri, connectOptions)
  .then(() => console.log('Mongo database connected'))
  .catch(() => console.log('ERROR: Mongo database not connected'));


module.exports = MyDB;