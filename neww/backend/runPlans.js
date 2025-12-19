const mongoose = require('mongoose');
const { seedPlans } = require('./utils/seedPlans');
require('dotenv').config();

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/recharge-app');
    console.log('Connected to MongoDB');
    
    await seedPlans();
    console.log('Plans seeding completed');
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

runSeed();