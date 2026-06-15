import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const mongoUriFromEnv = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME || 'webapp';
const origin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
const defaultMongoUri = 'mongodb://127.0.0.1:27017';

let client;
let usersCollection;
const inMemoryUsers = [];
let nextInMemoryId = 1;

function matchFilter(user, filter) {
  return Object.entries(filter).every(([key, value]) => {
    if (key === '_id') {
      return String(user._id) === String(value);
    }
    return user[key] === value;
  });
}

async function createInMemoryUsersCollection() {
  return {
    findOne: async (filter) => inMemoryUsers.find((user) => matchFilter(user, filter)) || null,
    insertOne: async (doc) => {
      const newDoc = { ...doc, _id: String(nextInMemoryId++) };
      inMemoryUsers.push(newDoc);
      return { insertedId: newDoc._id };
    },
  };
}

async function connectToMongo() {
  const mongoUri = mongoUriFromEnv || defaultMongoUri;

  try {
    client = new MongoClient(mongoUri);
    await client.connect();
    console.log(`Connected to MongoDB at ${mongoUri}`);
    const db = client.db(dbName);
    usersCollection = db.collection('users');
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`Failed to connect to MongoDB at ${mongoUri}. Falling back to in-memory auth storage for development.`);
      usersCollection = await createInMemoryUsersCollection();
    } else {
      console.error('Failed to connect to MongoDB:', error);
      process.exit(1);
    }
  }
}

await connectToMongo();

app.use(cors({ origin, credentials: true }));
app.use(express.json());

function safeUser(user) {
  const { password, ...rest } = user;
  return rest;
}

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existingUser = await usersCollection.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const hashedPassword = await bcrypt.hash(String(password), 10);
  const newUser = {
    name: String(name).trim(),
    email: normalizedEmail,
    role: 'customer',
    createdAt: new Date().toISOString(),
    password: hashedPassword,
  };

  const result = await usersCollection.insertOne(newUser);
  const savedUser = await usersCollection.findOne({ _id: result.insertedId });
  return res.status(201).json({ user: safeUser(savedUser) });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const account = await usersCollection.findOne({ email: normalizedEmail });
  if (!account) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const isValid = await bcrypt.compare(String(password), account.password);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  return res.json({ user: safeUser(account) });
});

app.listen(port, () => {
  console.log(`Backend API listening on http://localhost:${port}`);
});
