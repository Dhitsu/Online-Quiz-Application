const connectToMongoDB = require('../model/model.js');

const createUser = async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const collection = db.collection('authenticate');

    const existingUser = await collection.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const result = await collection.insertOne({ ...req.body, isAdmin: "false" });
    res.json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const collection = db.collection('authenticate');

    // Assuming req.body contains login credentials
    const user = await collection.findOne({ username: req.body.username, password: req.body.password });
    if (user) {
      res.json({ message: 'Login successful', data: user });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const fetchQuestions = async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const collection = db.collection('questions');

    const questions = await collection.find({}).toArray();
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const result = async (req, res) => {
  try {
    const { percentage, username } = req.body;

    const db = await connectToMongoDB();
    const collection = db.collection('result');

    const user = await collection.findOne({ username });

    if (!user) {
      const { insertedId } = await collection.insertOne({ username, result: percentage });
      result = { _id: insertedId, result: percentage };
    } else {
      const updatedResult = await collection.findOneAndUpdate(
        { _id: user._id },
        { $set: { result: percentage } },
        { returnOriginal: false }
      );
    }

    res.json({ result: percentage });
  } catch (error) {
    console.error('Error updating result:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getResults = async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const collection = db.collection('result');

    const results = await collection.find({}).toArray();
    res.json(results.map(({ username, result }) => ({ username, result })));
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createUser, loginUser, fetchQuestions, result, getResults };