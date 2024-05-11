const { MongoClient } = require('mongodb');

const mongoURI = 'mongodb://localhost:27017';
const dbName = 'quiz';

const connectToMongoDB = async () => {
  try {
    const client = new MongoClient(mongoURI);
    await client.connect();
    return client.db(dbName);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

module.exports = connectToMongoDB;
