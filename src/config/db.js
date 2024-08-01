const mongoose = require('mongoose');
const { MONGO_DB_URL } = require('../config/constants');

/**
 * @desc   Function that connect to the mongodb
 * @return void
 */

const connectToDb = async () => {
  const dbUri = MONGO_DB_URL;
  mongoose
    .connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Mongoose default connection open to ' + dbUri);
    })
    .catch((err) => {
      console.log('Mongoose default connection error: ' + err);
    });
  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
  });

  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      console.log(
        'Mongoose default connection disconnected through app termination',
      );
      process.exit(0);
    } catch (error) {
      console.error('Error during disconnection:', error);
      process.exit(1);
    }
  });

  return mongoose;
};

module.exports = connectToDb;
