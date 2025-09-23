const { MongoClient } = require('mongodb');

// MongoDB connection string - loaded from .env file
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

async function addNewUsers() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not set in the .env file.");
    return;
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(MONGODB_DB_NAME);
    const usersCollection = db.collection('users');

    // To create a regular user
    const newUser = {
      id: `user-${Date.now()}`,
      name: 'Test User',
      email: 'test.user@example.com',
      password: 'password123', // In a real app, this should be hashed
      numberPlate: 'TEST-123',
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    };

    let result = await usersCollection.insertOne(newUser);
    console.log('Successfully created user:', result.insertedId);

    // To create an admin
    const newAdmin = {
      id: `admin-${Date.now()}`,
      name: 'Test Admin',
      email: 'test.admin@example.com',
      password: 'adminpassword', // In a real app, this should be hashed
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    };

    result = await usersCollection.insertOne(newAdmin);
    console.log('Successfully created admin:', result.insertedId);

  } catch (error) {
    console.error('Error adding users:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

addNewUsers();
