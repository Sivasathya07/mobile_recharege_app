const mongoose = require('mongoose');
const { seedUsers } = require('./utils/seedData');
const { seedTransactions } = require('./utils/seedTransactions');
require('dotenv').config();

const seedAll = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/recharge-app');
    console.log('Connected to MongoDB');
    
    await seedUsers();
    await seedTransactions();
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedAll();