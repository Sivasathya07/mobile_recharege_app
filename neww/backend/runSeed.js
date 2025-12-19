const mongoose = require('mongoose');
const { seedUsers } = require('./utils/seedData');

// Connect to MongoDB and run seed
const runSeed = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/recharge-app');
    console.log('Connected to MongoDB');
    
    await seedUsers();
    
    console.log('Seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

runSeed();