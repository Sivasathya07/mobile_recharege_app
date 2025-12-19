const mongoose = require('mongoose');
const Plan = require('./models/Plan');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/recharge-app');
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const additionalPlans = [
  // More Airtel Plans
  { planId: 'AIR_79', operator: 'airtel_prepaid', planType: 'fulltt', amount: 79, validity: '28 days', description: 'Unlimited calls + 200MB/day', benefits: ['Unlimited Voice', '200MB Data/day', '100 SMS/day'] },
  { planId: 'AIR_95', operator: 'airtel_prepaid', planType: 'fulltt', amount: 95, validity: '28 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
  { planId: 'AIR_129', operator: 'airtel_prepaid', planType: 'fulltt', amount: 129, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
  { planId: 'AIR_169', operator: 'airtel_prepaid', planType: 'fulltt', amount: 169, validity: '28 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
  { planId: 'AIR_219', operator: 'airtel_prepaid', planType: 'fulltt', amount: 219, validity: '28 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
  { planId: 'AIR_249', operator: 'airtel_prepaid', planType: 'fulltt', amount: 249, validity: '28 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day'] },
  { planId: 'AIR_319', operator: 'airtel_prepaid', planType: 'fulltt', amount: 319, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
  { planId: 'AIR_479', operator: 'airtel_prepaid', planType: 'fulltt', amount: 479, validity: '56 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day'] },
  { planId: 'AIR_509', operator: 'airtel_prepaid', planType: 'fulltt', amount: 509, validity: '56 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
  { planId: 'AIR_589', operator: 'airtel_prepaid', planType: 'fulltt', amount: 589, validity: '56 days', description: 'Unlimited calls + 2.5GB/day', benefits: ['Unlimited Voice', '2.5GB Data/day', '100 SMS/day'] },
  
  // More Jio Plans
  { planId: 'JIO_75', operator: 'jio_prepaid', planType: 'fulltt', amount: 75, validity: '28 days', description: 'JioPhone Plan', benefits: ['2GB Data', 'Unlimited Voice', '300 SMS', 'JioApps'] },
  { planId: 'JIO_129', operator: 'jio_prepaid', planType: 'fulltt', amount: 129, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'JioApps'] },
  { planId: 'JIO_149', operator: 'jio_prepaid', planType: 'fulltt', amount: 149, validity: '28 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day', 'JioApps'] },
  { planId: 'JIO_199', operator: 'jio_prepaid', planType: 'fulltt', amount: 199, validity: '28 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day', 'JioApps'] },
  { planId: 'JIO_249', operator: 'jio_prepaid', planType: 'fulltt', amount: 249, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'JioApps'] },
  { planId: 'JIO_399', operator: 'jio_prepaid', planType: 'fulltt', amount: 399, validity: '28 days', description: 'Unlimited calls + 3GB/day', benefits: ['Unlimited Voice', '3GB Data/day', '100 SMS/day', 'JioApps', 'Netflix Mobile'] },
  { planId: 'JIO_449', operator: 'jio_prepaid', planType: 'fulltt', amount: 449, validity: '56 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'JioApps'] },
  { planId: 'JIO_599', operator: 'jio_prepaid', planType: 'fulltt', amount: 599, validity: '56 days', description: 'Unlimited calls + 2.5GB/day', benefits: ['Unlimited Voice', '2.5GB Data/day', '100 SMS/day', 'JioApps'] },
  { planId: 'JIO_749', operator: 'jio_prepaid', planType: 'fulltt', amount: 749, validity: '84 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'JioApps'] },
  { planId: 'JIO_1299', operator: 'jio_prepaid', planType: 'fulltt', amount: 1299, validity: '84 days', description: 'Unlimited calls + 3GB/day', benefits: ['Unlimited Voice', '3GB Data/day', '100 SMS/day', 'JioApps', 'Netflix Mobile'] },
  
  // More Vi Plans
  { planId: 'VI_79', operator: 'vi_prepaid', planType: 'fulltt', amount: 79, validity: '28 days', description: 'Unlimited calls + 200MB/day', benefits: ['Unlimited Voice', '200MB Data/day', '100 SMS/day'] },
  { planId: 'VI_95', operator: 'vi_prepaid', planType: 'fulltt', amount: 95, validity: '28 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
  { planId: 'VI_129', operator: 'vi_prepaid', planType: 'fulltt', amount: 129, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
  { planId: 'VI_199', operator: 'vi_prepaid', planType: 'fulltt', amount: 199, validity: '28 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day'] },
  { planId: 'VI_249', operator: 'vi_prepaid', planType: 'fulltt', amount: 249, validity: '28 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day'] },
  { planId: 'VI_299', operator: 'vi_prepaid', planType: 'fulltt', amount: 299, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'Vi Movies & TV'] },
  { planId: 'VI_399', operator: 'vi_prepaid', planType: 'fulltt', amount: 399, validity: '28 days', description: 'Unlimited calls + 2.5GB/day', benefits: ['Unlimited Voice', '2.5GB Data/day', '100 SMS/day', 'Weekend Data Rollover'] },
  { planId: 'VI_479', operator: 'vi_prepaid', planType: 'fulltt', amount: 479, validity: '56 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day'] },
  { planId: 'VI_599', operator: 'vi_prepaid', planType: 'fulltt', amount: 599, validity: '56 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
  { planId: 'VI_719', operator: 'vi_prepaid', planType: 'fulltt', amount: 719, validity: '84 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day'] },
  
  // More BSNL Plans
  { planId: 'BSNL_79', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 79, validity: '28 days', description: 'Unlimited calls + 200MB/day', benefits: ['Unlimited Voice', '200MB Data/day', '100 SMS/day'] },
  { planId: 'BSNL_99', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 99, validity: '28 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
  { planId: 'BSNL_129', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 129, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
  { planId: 'BSNL_149', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 149, validity: '35 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
  { planId: 'BSNL_199', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 199, validity: '45 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
  { planId: 'BSNL_349', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 349, validity: '65 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
  { planId: 'BSNL_429', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 429, validity: '85 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
  { planId: 'BSNL_549', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 549, validity: '90 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
  { planId: 'BSNL_797', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 797, validity: '150 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
  { planId: 'BSNL_1098', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 1098, validity: '200 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
];

const addPlans = async () => {
  try {
    await connectDB();
    
    console.log('🔄 Adding additional plans...');
    
    // Clear existing plans first
    await Plan.deleteMany({});
    console.log('🗑️ Cleared existing plans');
    
    // Add all plans (existing + new)
    const allPlans = [
      // Original plans from server.js
      { planId: 'AIR_155', operator: 'airtel_prepaid', planType: 'fulltt', amount: 155, validity: '24 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
      { planId: 'AIR_179', operator: 'airtel_prepaid', planType: 'fulltt', amount: 179, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
      { planId: 'AIR_199', operator: 'airtel_prepaid', planType: 'fulltt', amount: 199, validity: '24 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day', 'Wynk Music'] },
      { planId: 'AIR_265', operator: 'airtel_prepaid', planType: 'fulltt', amount: 265, validity: '28 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
      { planId: 'AIR_299', operator: 'airtel_prepaid', planType: 'fulltt', amount: 299, validity: '28 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day', 'Airtel Thanks'] },
      { planId: 'AIR_359', operator: 'airtel_prepaid', planType: 'fulltt', amount: 359, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'Disney+ Hotstar Mobile'] },
      { planId: 'AIR_399', operator: 'airtel_prepaid', planType: 'fulltt', amount: 399, validity: '28 days', description: 'Unlimited calls + 2.5GB/day', benefits: ['Unlimited Voice', '2.5GB Data/day', '100 SMS/day', 'Disney+ Hotstar Mobile', 'Wynk Music'] },
      { planId: 'AIR_449', operator: 'airtel_prepaid', planType: 'fulltt', amount: 449, validity: '56 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
      { planId: 'AIR_549', operator: 'airtel_prepaid', planType: 'fulltt', amount: 549, validity: '56 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'Disney+ Hotstar Mobile'] },
      { planId: 'AIR_719', operator: 'airtel_prepaid', planType: 'fulltt', amount: 719, validity: '84 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day'] },
      { planId: 'AIR_839', operator: 'airtel_prepaid', planType: 'fulltt', amount: 839, validity: '84 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'Disney+ Hotstar Mobile'] },
      { planId: 'AIR_999', operator: 'airtel_prepaid', planType: 'fulltt', amount: 999, validity: '84 days', description: 'Unlimited calls + 2.5GB/day', benefits: ['Unlimited Voice', '2.5GB Data/day', '100 SMS/day', 'Disney+ Hotstar Mobile', 'Amazon Prime'] },
      { planId: 'AIR_1799', operator: 'airtel_prepaid', planType: 'fulltt', amount: 1799, validity: '365 days', description: 'Unlimited calls + 24GB/month', benefits: ['Unlimited Voice', '24GB Data/month', '100 SMS/day', 'Disney+ Hotstar Mobile'] },
      { planId: 'AIR_2999', operator: 'airtel_prepaid', planType: 'fulltt', amount: 2999, validity: '365 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'Disney+ Hotstar Mobile', 'Amazon Prime'] },
      
      // Add new plans
      ...additionalPlans
    ];
    
    await Plan.insertMany(allPlans);
    
    const totalPlans = await Plan.countDocuments();
    console.log(`✅ Successfully added ${totalPlans} plans to database`);
    
    // Show count by operator
    const operators = ['airtel_prepaid', 'jio_prepaid', 'vi_prepaid', 'bsnl_prepaid'];
    for (const op of operators) {
      const count = await Plan.countDocuments({ operator: op });
      console.log(`📋 ${op}: ${count} plans`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding plans:', error);
    process.exit(1);
  }
};

addPlans();