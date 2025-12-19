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

const comprehensive100Plans = [
  // Airtel Prepaid Plans (30 plans)
  { planId: 'AIR_19', operator: 'airtel_prepaid', planType: 'data', amount: 19, validity: '1 day', description: '1GB Data', benefits: ['1GB Data'] },
  { planId: 'AIR_25', operator: 'airtel_prepaid', planType: 'data', amount: 25, validity: '2 days', description: '1.5GB Data', benefits: ['1.5GB Data'] },
  { planId: 'AIR_48', operator: 'airtel_prepaid', planType: 'data', amount: 48, validity: '3 days', description: '3GB Data', benefits: ['3GB Data'] },
  { planId: 'AIR_65', operator: 'airtel_prepaid', planType: 'data', amount: 65, validity: '7 days', description: '4GB Data', benefits: ['4GB Data'] },
  { planId: 'AIR_79', operator: 'airtel_prepaid', planType: 'fulltt', amount: 79, validity: '28 days', description: 'Unlimited calls + 200MB/day', benefits: ['Unlimited Voice', '200MB Data/day', '100 SMS/day'] },
  { planId: 'AIR_95', operator: 'airtel_prepaid', planType: 'fulltt', amount: 95, validity: '28 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
  { planId: 'AIR_98', operator: 'airtel_prepaid', planType: 'data', amount: 98, validity: '28 days', description: '6GB Data', benefits: ['6GB Data'] },
  { planId: 'AIR_118', operator: 'airtel_prepaid', planType: 'data', amount: 118, validity: '28 days', description: '12GB Data', benefits: ['12GB Data'] },
  { planId: 'AIR_129', operator: 'airtel_prepaid', planType: 'fulltt', amount: 129, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
  { planId: 'AIR_155', operator: 'airtel_prepaid', planType: 'fulltt', amount: 155, validity: '24 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
  { planId: 'AIR_169', operator: 'airtel_prepaid', planType: 'fulltt', amount: 169, validity: '28 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
  { planId: 'AIR_179', operator: 'airtel_prepaid', planType: 'fulltt', amount: 179, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
  { planId: 'AIR_199', operator: 'airtel_prepaid', planType: 'fulltt', amount: 199, validity: '24 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day', 'Wynk Music'] },
  { planId: 'AIR_219', operator: 'airtel_prepaid', planType: 'fulltt', amount: 219, validity: '28 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
  { planId: 'AIR_249', operator: 'airtel_prepaid', planType: 'fulltt', amount: 249, validity: '28 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day'] },
  { planId: 'AIR_265', operator: 'airtel_prepaid', planType: 'fulltt', amount: 265, validity: '28 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
  { planId: 'AIR_299', operator: 'airtel_prepaid', planType: 'fulltt', amount: 299, validity: '28 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day', 'Airtel Thanks'] },
  { planId: 'AIR_319', operator: 'airtel_prepaid', planType: 'fulltt', amount: 319, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
  { planId: 'AIR_359', operator: 'airtel_prepaid', planType: 'fulltt', amount: 359, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'Disney+ Hotstar Mobile'] },
  { planId: 'AIR_399', operator: 'airtel_prepaid', planType: 'fulltt', amount: 399, validity: '28 days', description: 'Unlimited calls + 2.5GB/day', benefits: ['Unlimited Voice', '2.5GB Data/day', '100 SMS/day', 'Disney+ Hotstar Mobile', 'Wynk Music'] },
  { planId: 'AIR_449', operator: 'airtel_prepaid', planType: 'fulltt', amount: 449, validity: '56 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
  { planId: 'AIR_479', operator: 'airtel_prepaid', planType: 'fulltt', amount: 479, validity: '56 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day'] },
  { planId: 'AIR_509', operator: 'airtel_prepaid', planType: 'fulltt', amount: 509, validity: '56 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
  { planId: 'AIR_549', operator: 'airtel_prepaid', planType: 'fulltt', amount: 549, validity: '56 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'Disney+ Hotstar Mobile'] },
  { planId: 'AIR_589', operator: 'airtel_prepaid', planType: 'fulltt', amount: 589, validity: '56 days', description: 'Unlimited calls + 2.5GB/day', benefits: ['Unlimited Voice', '2.5GB Data/day', '100 SMS/day'] },
  { planId: 'AIR_719', operator: 'airtel_prepaid', planType: 'fulltt', amount: 719, validity: '84 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day'] },
  { planId: 'AIR_839', operator: 'airtel_prepaid', planType: 'fulltt', amount: 839, validity: '84 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'Disney+ Hotstar Mobile'] },
  { planId: 'AIR_999', operator: 'airtel_prepaid', planType: 'fulltt', amount: 999, validity: '84 days', description: 'Unlimited calls + 2.5GB/day', benefits: ['Unlimited Voice', '2.5GB Data/day', '100 SMS/day', 'Disney+ Hotstar Mobile', 'Amazon Prime'] },
  { planId: 'AIR_1799', operator: 'airtel_prepaid', planType: 'fulltt', amount: 1799, validity: '365 days', description: 'Unlimited calls + 24GB/month', benefits: ['Unlimited Voice', '24GB Data/month', '100 SMS/day', 'Disney+ Hotstar Mobile'] },
  { planId: 'AIR_2999', operator: 'airtel_prepaid', planType: 'fulltt', amount: 2999, validity: '365 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'Disney+ Hotstar Mobile', 'Amazon Prime'] },

  // Jio Prepaid Plans (30 plans)
  { planId: 'JIO_15', operator: 'jio_prepaid', planType: 'data', amount: 15, validity: '1 day', description: '1GB Data', benefits: ['1GB Data'] },
  { planId: 'JIO_25', operator: 'jio_prepaid', planType: 'data', amount: 25, validity: '2 days', description: '1.5GB Data', benefits: ['1.5GB Data'] },
  { planId: 'JIO_39', operator: 'jio_prepaid', planType: 'data', amount: 39, validity: '7 days', description: '2.5GB Data', benefits: ['2.5GB Data'] },
  { planId: 'JIO_69', operator: 'jio_prepaid', planType: 'data', amount: 69, validity: '28 days', description: '6GB Data', benefits: ['6GB Data'] },
  { planId: 'JIO_75', operator: 'jio_prepaid', planType: 'fulltt', amount: 75, validity: '28 days', description: 'JioPhone Plan', benefits: ['2GB Data', 'Unlimited Voice', '300 SMS', 'JioApps'] },
  { planId: 'JIO_99', operator: 'jio_prepaid', planType: 'data', amount: 99, validity: '28 days', description: '10GB Data', benefits: ['10GB Data'] },
  { planId: 'JIO_129', operator: 'jio_prepaid', planType: 'fulltt', amount: 129, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'JioApps'] },
  { planId: 'JIO_149', operator: 'jio_prepaid', planType: 'fulltt', amount: 149, validity: '28 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day', 'JioApps'] },
  { planId: 'JIO_155', operator: 'jio_prepaid', planType: 'fulltt', amount: 155, validity: '24 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'JioApps'] },
  { planId: 'JIO_179', operator: 'jio_prepaid', planType: 'fulltt', amount: 179, validity: '28 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day', 'JioApps'] },
  { planId: 'JIO_199', operator: 'jio_prepaid', planType: 'fulltt', amount: 199, validity: '28 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day', 'JioApps'] },
  { planId: 'JIO_209', operator: 'jio_prepaid', planType: 'fulltt', amount: 209, validity: '28 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day', 'JioApps'] },
  { planId: 'JIO_239', operator: 'jio_prepaid', planType: 'fulltt', amount: 239, validity: '28 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day', 'JioApps'] },
  { planId: 'JIO_249', operator: 'jio_prepaid', planType: 'fulltt', amount: 249, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'JioApps'] },
  { planId: 'JIO_299', operator: 'jio_prepaid', planType: 'fulltt', amount: 299, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'JioApps'] },
  { planId: 'JIO_349', operator: 'jio_prepaid', planType: 'fulltt', amount: 349, validity: '28 days', description: 'Unlimited calls + 2.5GB/day', benefits: ['Unlimited Voice', '2.5GB Data/day', '100 SMS/day', 'JioApps', 'Netflix Mobile'] },
  { planId: 'JIO_395', operator: 'jio_prepaid', planType: 'fulltt', amount: 395, validity: '84 days', description: 'Unlimited calls + 6GB total', benefits: ['Unlimited Voice', '6GB Total Data', '1000 SMS', 'JioApps'] },
  { planId: 'JIO_399', operator: 'jio_prepaid', planType: 'fulltt', amount: 399, validity: '28 days', description: 'Unlimited calls + 3GB/day', benefits: ['Unlimited Voice', '3GB Data/day', '100 SMS/day', 'JioApps', 'Netflix Mobile'] },
  { planId: 'JIO_449', operator: 'jio_prepaid', planType: 'fulltt', amount: 449, validity: '56 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'JioApps'] },
  { planId: 'JIO_533', operator: 'jio_prepaid', planType: 'fulltt', amount: 533, validity: '56 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'JioApps'] },
  { planId: 'JIO_599', operator: 'jio_prepaid', planType: 'fulltt', amount: 599, validity: '56 days', description: 'Unlimited calls + 2.5GB/day', benefits: ['Unlimited Voice', '2.5GB Data/day', '100 SMS/day', 'JioApps'] },
  { planId: 'JIO_666', operator: 'jio_prepaid', planType: 'fulltt', amount: 666, validity: '84 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day', 'JioApps'] },
  { planId: 'JIO_719', operator: 'jio_prepaid', planType: 'fulltt', amount: 719, validity: '84 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day', 'JioApps'] },
  { planId: 'JIO_749', operator: 'jio_prepaid', planType: 'fulltt', amount: 749, validity: '84 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'JioApps'] },
  { planId: 'JIO_999', operator: 'jio_prepaid', planType: 'fulltt', amount: 999, validity: '84 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'JioApps', 'Netflix Mobile'] },
  { planId: 'JIO_1299', operator: 'jio_prepaid', planType: 'fulltt', amount: 1299, validity: '84 days', description: 'Unlimited calls + 3GB/day', benefits: ['Unlimited Voice', '3GB Data/day', '100 SMS/day', 'JioApps', 'Netflix Mobile'] },
  { planId: 'JIO_1559', operator: 'jio_prepaid', planType: 'fulltt', amount: 1559, validity: '336 days', description: 'Unlimited calls + 24GB/month', benefits: ['Unlimited Voice', '24GB Data/month', '3600 SMS', 'JioApps'] },
  { planId: 'JIO_2999', operator: 'jio_prepaid', planType: 'fulltt', amount: 2999, validity: '365 days', description: 'Unlimited calls + 2.5GB/day', benefits: ['Unlimited Voice', '2.5GB Data/day', '100 SMS/day', 'JioApps', 'Netflix Mobile'] },
  { planId: 'JIO_4199', operator: 'jio_prepaid', planType: 'fulltt', amount: 4199, validity: '365 days', description: 'Unlimited calls + 3GB/day', benefits: ['Unlimited Voice', '3GB Data/day', '100 SMS/day', 'JioApps', 'Netflix Premium'] },
  { planId: 'JIO_5999', operator: 'jio_prepaid', planType: 'fulltt', amount: 5999, validity: '365 days', description: 'Unlimited calls + 4GB/day', benefits: ['Unlimited Voice', '4GB Data/day', '100 SMS/day', 'JioApps', 'All Premium OTT'] },

  // Vi Prepaid Plans (25 plans)
  { planId: 'VI_16', operator: 'vi_prepaid', planType: 'data', amount: 16, validity: '1 day', description: '1GB Data', benefits: ['1GB Data'] },
  { planId: 'VI_29', operator: 'vi_prepaid', planType: 'data', amount: 29, validity: '2 days', description: '2GB Data', benefits: ['2GB Data'] },
  { planId: 'VI_48', operator: 'vi_prepaid', planType: 'data', amount: 48, validity: '7 days', description: '3GB Data', benefits: ['3GB Data'] },
  { planId: 'VI_58', operator: 'vi_prepaid', planType: 'data', amount: 58, validity: '28 days', description: '3GB Data', benefits: ['3GB Data'] },
  { planId: 'VI_79', operator: 'vi_prepaid', planType: 'fulltt', amount: 79, validity: '28 days', description: 'Unlimited calls + 200MB/day', benefits: ['Unlimited Voice', '200MB Data/day', '100 SMS/day'] },
  { planId: 'VI_95', operator: 'vi_prepaid', planType: 'fulltt', amount: 95, validity: '28 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
  { planId: 'VI_118', operator: 'vi_prepaid', planType: 'data', amount: 118, validity: '28 days', description: '12GB Data', benefits: ['12GB Data'] },
  { planId: 'VI_129', operator: 'vi_prepaid', planType: 'fulltt', amount: 129, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
  { planId: 'VI_155', operator: 'vi_prepaid', planType: 'fulltt', amount: 155, validity: '24 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
  { planId: 'VI_179', operator: 'vi_prepaid', planType: 'fulltt', amount: 179, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
  { planId: 'VI_181', operator: 'vi_prepaid', planType: 'data', amount: 181, validity: '30 days', description: '30GB Data', benefits: ['30GB Data'] },
  { planId: 'VI_199', operator: 'vi_prepaid', planType: 'fulltt', amount: 199, validity: '28 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day'] },
  { planId: 'VI_219', operator: 'vi_prepaid', planType: 'fulltt', amount: 219, validity: '28 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day', 'Vi Movies & TV'] },
  { planId: 'VI_249', operator: 'vi_prepaid', planType: 'fulltt', amount: 249, validity: '28 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day'] },
  { planId: 'VI_269', operator: 'vi_prepaid', planType: 'fulltt', amount: 269, validity: '28 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day'] },
  { planId: 'VI_299', operator: 'vi_prepaid', planType: 'fulltt', amount: 299, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'Vi Movies & TV'] },
  { planId: 'VI_301', operator: 'vi_prepaid', planType: 'data', amount: 301, validity: '30 days', description: '50GB Data', benefits: ['50GB Data'] },
  { planId: 'VI_319', operator: 'vi_prepaid', planType: 'fulltt', amount: 319, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'Binge All Night'] },
  { planId: 'VI_359', operator: 'vi_prepaid', planType: 'fulltt', amount: 359, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'Weekend Data Rollover'] },
  { planId: 'VI_399', operator: 'vi_prepaid', planType: 'fulltt', amount: 399, validity: '28 days', description: 'Unlimited calls + 2.5GB/day', benefits: ['Unlimited Voice', '2.5GB Data/day', '100 SMS/day', 'Weekend Data Rollover'] },
  { planId: 'VI_449', operator: 'vi_prepaid', planType: 'fulltt', amount: 449, validity: '56 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
  { planId: 'VI_479', operator: 'vi_prepaid', planType: 'fulltt', amount: 479, validity: '56 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day'] },
  { planId: 'VI_539', operator: 'vi_prepaid', planType: 'fulltt', amount: 539, validity: '56 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
  { planId: 'VI_699', operator: 'vi_prepaid', planType: 'fulltt', amount: 699, validity: '84 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day'] },
  { planId: 'VI_859', operator: 'vi_prepaid', planType: 'fulltt', amount: 859, validity: '84 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'Weekend Data Rollover'] },

  // BSNL Prepaid Plans (15 plans)
  { planId: 'BSNL_17', operator: 'bsnl_prepaid', planType: 'data', amount: 17, validity: '1 day', description: '1GB Data', benefits: ['1GB Data'] },
  { planId: 'BSNL_22', operator: 'bsnl_prepaid', planType: 'data', amount: 22, validity: '2 days', description: '1GB Data', benefits: ['1GB Data'] },
  { planId: 'BSNL_47', operator: 'bsnl_prepaid', planType: 'data', amount: 47, validity: '30 days', description: '2GB Data', benefits: ['2GB Data'] },
  { planId: 'BSNL_79', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 79, validity: '28 days', description: 'Unlimited calls + 200MB/day', benefits: ['Unlimited Voice', '200MB Data/day', '100 SMS/day'] },
  { planId: 'BSNL_97', operator: 'bsnl_prepaid', planType: 'data', amount: 97, validity: '30 days', description: '10GB Data', benefits: ['10GB Data'] },
  { planId: 'BSNL_99', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 99, validity: '28 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
  { planId: 'BSNL_108', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 108, validity: '25 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
  { planId: 'BSNL_129', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 129, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
  { planId: 'BSNL_147', operator: 'bsnl_prepaid', planType: 'data', amount: 147, validity: '30 days', description: '20GB Data', benefits: ['20GB Data'] },
  { planId: 'BSNL_187', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 187, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
  { planId: 'BSNL_247', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 247, validity: '45 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
  { planId: 'BSNL_297', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 297, validity: '54 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
  { planId: 'BSNL_397', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 397, validity: '80 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
  { planId: 'BSNL_499', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 499, validity: '90 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
  { planId: 'BSNL_666', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 666, validity: '160 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] }
];

const add100Plans = async () => {
  try {
    await connectDB();
    
    console.log('🔄 Adding 100+ comprehensive plans...');
    
    // Clear existing plans
    await Plan.deleteMany({});
    console.log('🗑️ Cleared existing plans');
    
    // Add all 100+ plans
    await Plan.insertMany(comprehensive100Plans);
    
    const totalPlans = await Plan.countDocuments();
    console.log(`✅ Successfully added ${totalPlans} plans to database`);
    
    // Show count by operator
    const operators = ['airtel_prepaid', 'jio_prepaid', 'vi_prepaid', 'bsnl_prepaid'];
    for (const op of operators) {
      const count = await Plan.countDocuments({ operator: op });
      console.log(`📋 ${op}: ${count} plans`);
    }
    
    console.log('🎉 Your website now has 100+ plans available!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding plans:', error);
    process.exit(1);
  }
};

add100Plans();