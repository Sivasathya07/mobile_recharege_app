const mongoose = require('mongoose');
const { seedTransactions } = require('./utils/seedTransactions');
require('dotenv').config();

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/recharge-app');
    console.log('Connected to MongoDB');
    
    await seedTransactions();
    console.log('Transaction seeding completed');
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

runSeed();