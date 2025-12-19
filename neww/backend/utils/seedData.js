const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedUsers = async () => {
  try {
    // Check if users already exist
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('Users already exist, skipping seed');
      return;
    }

    // Create demo users with hashed passwords
    const users = [
      {
        name: 'Demo User',
        email: 'user@demo.com',
        phone: '9876543210',
        password: await bcrypt.hash('password123', 12),
        balance: 1000,
        role: 'user'
      },
      {
        name: 'Admin User',
        email: 'admin@demo.com',
        phone: '9123456789',
        password: await bcrypt.hash('admin123', 12),
        balance: 5000,
        role: 'admin'
      }
    ];

    await User.insertMany(users);
    console.log('Demo users created successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

module.exports = { seedUsers };