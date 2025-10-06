require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

const adminUser = {
  id: "admin-68a78c9ca5124e12cefe1eb9",
  email: "admin@bikeviolation.gov",
  password: "admin12345",
  firstName: "System",
  lastName: "Administrator",
  role: "super_admin",
  department: "management",
  permissions: [
    { resource: "violations", actions: ["view", "create", "edit", "delete", "approve"] },
    { resource: "users", actions: ["view", "create", "edit", "delete"] },
    { resource: "payments", actions: ["view", "create", "edit", "delete"] },
    { resource: "queries", actions: ["view", "create", "edit", "delete"] },
    { resource: "reports", actions: ["view", "create", "edit", "delete"] },
    { resource: "settings", actions: ["view", "create", "edit", "delete"] }
  ],
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

async function createAdmin() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not set in the .env file.");
    return;
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(MONGODB_DB_NAME);
    const adminUsersCollection = db.collection('admin_users');

    // Check if the admin user already exists
    const existingAdmin = await adminUsersCollection.findOne({ email: adminUser.email });
    if (existingAdmin) {
      console.log('Admin user with this email already exists.');
      return;
    }

    const result = await adminUsersCollection.insertOne(adminUser);
    console.log(`Successfully created admin user with email: ${adminUser.email}`);

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

createAdmin();
