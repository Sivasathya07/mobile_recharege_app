const mongoose = require('mongoose');
const { seedPlans } = require('./utils/seedPlans');

const runSeed = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/recharge-app');
    console.log('Connected to MongoDB');
    
    await seedPlans();
    
    console.log('Plan seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Plan seeding failed:', error);
    process.exit(1);
  }
};

runSeed();