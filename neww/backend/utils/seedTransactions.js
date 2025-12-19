const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Plan = require('../models/Plan');

const seedTransactions = async () => {
  try {
    // Check if transactions already exist
    const existingTransactions = await Transaction.countDocuments();
    if (existingTransactions > 0) {
      console.log('Transactions already exist, skipping seed');
      return;
    }

    // Get users and plans
    const users = await User.find({});
    const plans = await Plan.find({});
    
    if (users.length === 0) {
      console.log('No users found. Please seed users first.');
      return;
    }
    
    if (plans.length === 0) {
      console.log('No plans found. Using default plan amounts.');
      // Use common plan amounts if no plans in DB
      const defaultAmounts = [155, 179, 299, 399, 549, 719, 999, 1799];
      plans.push(...defaultAmounts.map(amount => ({ amount, operator: 'airtel_prepaid', planId: `PLAN_${amount}` })));
    }

    const transactions = [];
    const phoneNumbers = ['9876543210', '9123456789', '8765432109', '7654321098', '9988776655'];
    const operators = ['airtel_prepaid', 'jio_prepaid', 'vi_prepaid', 'bsnl_prepaid'];
    
    // Generate 200 realistic transactions over the last 30 days
    for (let i = 0; i < 200; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomPlan = plans[Math.floor(Math.random() * plans.length)];
      const randomPhone = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];
      
      // Create date within last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
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
        status: Math.random() > 0.05 ? 'success' : 'failed', // 95% success rate
        transactionId: 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9),
        paymentMethod: Math.random() > 0.6 ? 'wallet' : 'card',
        description: `Recharge for ${randomPhone} - ${randomPlan.operator}`,
        createdAt: transactionDate,
        updatedAt: transactionDate
      };

      transactions.push(transaction);
    }

    await Transaction.insertMany(transactions);
    console.log(`Successfully seeded ${transactions.length} transactions`);
  } catch (error) {
    console.error('Error seeding transactions:', error);
  }
};

module.exports = { seedTransactions };