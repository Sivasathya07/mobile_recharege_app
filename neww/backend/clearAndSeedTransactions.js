const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');
const User = require('./models/User');
const Plan = require('./models/Plan');
require('dotenv').config();

const clearAndSeedTransactions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/recharge-app');
    console.log('Connected to MongoDB');
    
    // Clear existing transactions
    await Transaction.deleteMany({});
    console.log('Cleared existing transactions');

    // Get users and plans
    const users = await User.find({});
    const plans = await Plan.find({});
    
    if (users.length === 0 || plans.length === 0) {
      console.log('No users or plans found. Please seed users and plans first.');
      return;
    }

    const transactions = [];
    const phoneNumbers = ['9876543210', '9123456789', '8765432109', '7654321098', '9988776655', '8899776655', '7788996655'];
    
    // Generate 300 realistic transactions over the last 60 days
    for (let i = 0; i < 300; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomPlan = plans[Math.floor(Math.random() * plans.length)];
      const randomPhone = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];
      
      // Create date within last 60 days with more recent transactions
      const daysAgo = Math.floor(Math.random() * 60);
      const hoursAgo = Math.floor(Math.random() * 24);
      const minutesAgo = Math.floor(Math.random() * 60);
      const transactionDate = new Date();
      transactionDate.setDate(transactionDate.getDate() - daysAgo);
      transactionDate.setHours(transactionDate.getHours() - hoursAgo);
      transactionDate.setMinutes(transactionDate.getMinutes() - minutesAgo);

      const transaction = {
        userId: randomUser._id,
        type: 'recharge',
        amount: randomPlan.amount,
        number: randomPhone,
        operator: randomPlan.operator,
        plan: {
          name: randomPlan.description,
          validity: randomPlan.validity,
          planId: randomPlan.planId
        },
        status: Math.random() > 0.03 ? 'success' : 'failed', // 97% success rate
        transactionId: 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9),
        paymentMethod: Math.random() > 0.4 ? 'wallet' : 'card',
        description: `Recharge for ${randomPhone} - ${randomPlan.operator}`,
        createdAt: transactionDate,
        updatedAt: transactionDate
      };

      transactions.push(transaction);
    }

    await Transaction.insertMany(transactions);
    console.log(`Successfully seeded ${transactions.length} transactions`);
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

clearAndSeedTransactions();