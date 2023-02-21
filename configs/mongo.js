const mongoose = require('mongoose');

const {
  dbConnection,
  dbName
} = require('../env.configs');

exports.init = () => {
  mongoose.connect(
    dbConnection,
    {
      dbName,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
  let db = mongoose.connection;

  db.on('error', (e) => {
    console.log('Database connect Error!') });

  db.once('open', () => {
    console.log('Database is Connected');
  })
}
