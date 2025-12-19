const mongoose = require('mongoose');
const Plan = require('./models/Plan');

const plans = [
  // Airtel Plans (30 plans)
  { planId: "AIR001", operator: "Airtel", amount: 19, validity: "1 day", benefits: ["200MB data"], description: "Emergency data pack", planType: "data" },
  { operator: "Airtel", type: "prepaid", amount: 29, validity: "2 days", benefits: "500MB data", description: "Weekend pack" },
  { operator: "Airtel", type: "prepaid", amount: 49, validity: "3 days", benefits: "1GB data", description: "Short term pack" },
  { operator: "Airtel", type: "prepaid", amount: 65, validity: "4 days", benefits: "1.5GB data", description: "Extended pack" },
  { operator: "Airtel", type: "prepaid", amount: 79, validity: "7 days", benefits: "1GB/day", description: "Weekly pack" },
  { operator: "Airtel", type: "prepaid", amount: 95, validity: "10 days", benefits: "1GB/day", description: "10-day pack" },
  { operator: "Airtel", type: "prepaid", amount: 129, validity: "14 days", benefits: "1GB/day", description: "Fortnightly pack" },
  { operator: "Airtel", type: "prepaid", amount: 155, validity: "24 days", benefits: "1GB/day", description: "24-day pack" },
  { operator: "Airtel", type: "prepaid", amount: 179, validity: "28 days", benefits: "1.5GB/day", description: "Monthly starter" },
  { operator: "Airtel", type: "prepaid", amount: 199, validity: "28 days", benefits: "1.5GB/day + calls", description: "Popular pack" },
  { operator: "Airtel", type: "prepaid", amount: 239, validity: "28 days", benefits: "2GB/day", description: "High data pack" },
  { operator: "Airtel", type: "prepaid", amount: 265, validity: "28 days", benefits: "2GB/day + OTT", description: "Entertainment pack" },
  { operator: "Airtel", type: "prepaid", amount: 299, validity: "28 days", benefits: "2.5GB/day", description: "Premium pack" },
  { operator: "Airtel", type: "prepaid", amount: 319, validity: "30 days", benefits: "2.5GB/day", description: "30-day pack" },
  { operator: "Airtel", type: "prepaid", amount: 359, validity: "28 days", benefits: "3GB/day", description: "Heavy user pack" },
  { operator: "Airtel", type: "prepaid", amount: 399, validity: "56 days", benefits: "2GB/day", description: "2-month pack" },
  { operator: "Airtel", type: "prepaid", amount: 449, validity: "56 days", benefits: "2.5GB/day", description: "Extended validity" },
  { operator: "Airtel", type: "prepaid", amount: 479, validity: "56 days", benefits: "3GB/day", description: "Long term pack" },
  { operator: "Airtel", type: "prepaid", amount: 549, validity: "70 days", benefits: "2GB/day", description: "70-day pack" },
  { operator: "Airtel", type: "prepaid", amount: 599, validity: "84 days", benefits: "2GB/day", description: "Quarterly pack" },
  { operator: "Airtel", type: "prepaid", amount: 699, validity: "84 days", benefits: "2.5GB/day", description: "Premium quarterly" },
  { operator: "Airtel", type: "prepaid", amount: 799, validity: "90 days", benefits: "3GB/day", description: "90-day pack" },
  { operator: "Airtel", type: "prepaid", amount: 999, validity: "120 days", benefits: "2.5GB/day", description: "4-month pack" },
  { operator: "Airtel", type: "prepaid", amount: 1199, validity: "150 days", benefits: "3GB/day", description: "5-month pack" },
  { operator: "Airtel", type: "prepaid", amount: 1499, validity: "180 days", benefits: "3GB/day", description: "6-month pack" },
  { operator: "Airtel", type: "prepaid", amount: 1799, validity: "240 days", benefits: "2.5GB/day", description: "8-month pack" },
  { operator: "Airtel", type: "prepaid", amount: 2399, validity: "365 days", benefits: "2GB/day", description: "Annual pack" },
  { operator: "Airtel", type: "prepaid", amount: 2999, validity: "365 days", benefits: "2.5GB/day", description: "Premium annual" },
  { operator: "Airtel", type: "prepaid", amount: 3359, validity: "365 days", benefits: "3GB/day", description: "Ultimate annual" },
  { operator: "Airtel", type: "prepaid", amount: 3999, validity: "365 days", benefits: "4GB/day", description: "Max annual" },

  // Jio Plans (30 plans)
  { operator: "Jio", type: "prepaid", amount: 22, validity: "1 day", benefits: "200MB data", description: "Daily booster" },
  { operator: "Jio", type: "prepaid", amount: 39, validity: "2 days", benefits: "500MB data", description: "Weekend special" },
  { operator: "Jio", type: "prepaid", amount: 52, validity: "3 days", benefits: "1GB data", description: "3-day pack" },
  { operator: "Jio", type: "prepaid", amount: 69, validity: "7 days", benefits: "1GB/day", description: "Weekly pack" },
  { operator: "Jio", type: "prepaid", amount: 89, validity: "10 days", benefits: "1GB/day", description: "10-day special" },
  { operator: "Jio", type: "prepaid", amount: 119, validity: "14 days", benefits: "1GB/day", description: "2-week pack" },
  { operator: "Jio", type: "prepaid", amount: 149, validity: "20 days", benefits: "1.5GB/day", description: "20-day pack" },
  { operator: "Jio", type: "prepaid", amount: 179, validity: "28 days", benefits: "1.5GB/day", description: "Monthly basic" },
  { operator: "Jio", type: "prepaid", amount: 209, validity: "28 days", benefits: "1.5GB/day + apps", description: "App bundle" },
  { operator: "Jio", type: "prepaid", amount: 239, validity: "28 days", benefits: "2GB/day", description: "Standard pack" },
  { operator: "Jio", type: "prepaid", amount: 269, validity: "28 days", benefits: "2GB/day + OTT", description: "Entertainment" },
  { operator: "Jio", type: "prepaid", amount: 299, validity: "28 days", benefits: "2.5GB/day", description: "High data" },
  { operator: "Jio", type: "prepaid", amount: 329, validity: "28 days", benefits: "2.5GB/day + Netflix", description: "Netflix bundle" },
  { operator: "Jio", type: "prepaid", amount: 349, validity: "28 days", benefits: "3GB/day", description: "Premium pack" },
  { operator: "Jio", type: "prepaid", amount: 379, validity: "28 days", benefits: "3GB/day + apps", description: "All-in-one" },
  { operator: "Jio", type: "prepaid", amount: 399, validity: "56 days", benefits: "2GB/day", description: "2-month basic" },
  { operator: "Jio", type: "prepaid", amount: 479, validity: "56 days", benefits: "2.5GB/day", description: "2-month premium" },
  { operator: "Jio", type: "prepaid", amount: 533, validity: "56 days", benefits: "3GB/day", description: "2-month max" },
  { operator: "Jio", type: "prepaid", amount: 599, validity: "84 days", benefits: "2GB/day", description: "3-month pack" },
  { operator: "Jio", type: "prepaid", amount: 719, validity: "84 days", benefits: "2.5GB/day", description: "3-month premium" },
  { operator: "Jio", type: "prepaid", amount: 799, validity: "84 days", benefits: "3GB/day", description: "3-month max" },
  { operator: "Jio", type: "prepaid", amount: 999, validity: "120 days", benefits: "2.5GB/day", description: "4-month pack" },
  { operator: "Jio", type: "prepaid", amount: 1299, validity: "150 days", benefits: "3GB/day", description: "5-month pack" },
  { operator: "Jio", type: "prepaid", amount: 1559, validity: "180 days", benefits: "3GB/day", description: "6-month pack" },
  { operator: "Jio", type: "prepaid", amount: 1899, validity: "240 days", benefits: "2.5GB/day", description: "8-month pack" },
  { operator: "Jio", type: "prepaid", amount: 2545, validity: "336 days", benefits: "2.5GB/day", description: "11-month pack" },
  { operator: "Jio", type: "prepaid", amount: 2879, validity: "365 days", benefits: "2.5GB/day", description: "Annual pack" },
  { operator: "Jio", type: "prepaid", amount: 3119, validity: "365 days", benefits: "3GB/day", description: "Annual premium" },
  { operator: "Jio", type: "prepaid", amount: 3599, validity: "365 days", benefits: "3.5GB/day", description: "Annual max" },
  { operator: "Jio", type: "prepaid", amount: 4199, validity: "365 days", benefits: "4GB/day", description: "Ultimate annual" },

  // Vi Plans (30 plans)
  { operator: "Vi", type: "prepaid", amount: 24, validity: "1 day", benefits: "200MB data", description: "Emergency pack" },
  { operator: "Vi", type: "prepaid", amount: 44, validity: "2 days", benefits: "500MB data", description: "2-day pack" },
  { operator: "Vi", type: "prepaid", amount: 58, validity: "3 days", benefits: "1GB data", description: "3-day special" },
  { operator: "Vi", type: "prepaid", amount: 79, validity: "7 days", benefits: "1GB/day", description: "Weekly pack" },
  { operator: "Vi", type: "prepaid", amount: 99, validity: "10 days", benefits: "1GB/day", description: "10-day pack" },
  { operator: "Vi", type: "prepaid", amount: 139, validity: "14 days", benefits: "1.5GB/day", description: "Fortnightly" },
  { operator: "Vi", type: "prepaid", amount: 169, validity: "21 days", benefits: "1.5GB/day", description: "3-week pack" },
  { operator: "Vi", type: "prepaid", amount: 199, validity: "28 days", benefits: "1.5GB/day", description: "Monthly starter" },
  { operator: "Vi", type: "prepaid", amount: 219, validity: "28 days", benefits: "1.5GB/day + calls", description: "Standard pack" },
  { operator: "Vi", type: "prepaid", amount: 249, validity: "28 days", benefits: "2GB/day", description: "High data" },
  { operator: "Vi", type: "prepaid", amount: 279, validity: "28 days", benefits: "2GB/day + OTT", description: "Entertainment" },
  { operator: "Vi", type: "prepaid", amount: 319, validity: "28 days", benefits: "2.5GB/day", description: "Premium pack" },
  { operator: "Vi", type: "prepaid", amount: 359, validity: "28 days", benefits: "3GB/day", description: "Max pack" },
  { operator: "Vi", type: "prepaid", amount: 379, validity: "28 days", benefits: "3GB/day + apps", description: "Ultimate pack" },
  { operator: "Vi", type: "prepaid", amount: 399, validity: "28 days", benefits: "3.5GB/day", description: "Super pack" },
  { operator: "Vi", type: "prepaid", amount: 449, validity: "56 days", benefits: "2GB/day", description: "2-month basic" },
  { operator: "Vi", type: "prepaid", amount: 519, validity: "56 days", benefits: "2.5GB/day", description: "2-month premium" },
  { operator: "Vi", type: "prepaid", amount: 599, validity: "56 days", benefits: "3GB/day", description: "2-month max" },
  { operator: "Vi", type: "prepaid", amount: 699, validity: "84 days", benefits: "2GB/day", description: "3-month pack" },
  { operator: "Vi", type: "prepaid", amount: 799, validity: "84 days", benefits: "2.5GB/day", description: "3-month premium" },
  { operator: "Vi", type: "prepaid", amount: 899, validity: "84 days", benefits: "3GB/day", description: "3-month max" },
  { operator: "Vi", type: "prepaid", amount: 1099, validity: "120 days", benefits: "2.5GB/day", description: "4-month pack" },
  { operator: "Vi", type: "prepaid", amount: 1399, validity: "150 days", benefits: "3GB/day", description: "5-month pack" },
  { operator: "Vi", type: "prepaid", amount: 1699, validity: "180 days", benefits: "3GB/day", description: "6-month pack" },
  { operator: "Vi", type: "prepaid", amount: 2099, validity: "240 days", benefits: "2.5GB/day", description: "8-month pack" },
  { operator: "Vi", type: "prepaid", amount: 2699, validity: "336 days", benefits: "2.5GB/day", description: "11-month pack" },
  { operator: "Vi", type: "prepaid", amount: 2999, validity: "365 days", benefits: "2.5GB/day", description: "Annual pack" },
  { operator: "Vi", type: "prepaid", amount: 3299, validity: "365 days", benefits: "3GB/day", description: "Annual premium" },
  { operator: "Vi", type: "prepaid", amount: 3799, validity: "365 days", benefits: "3.5GB/day", description: "Annual max" },
  { operator: "Vi", type: "prepaid", amount: 4399, validity: "365 days", benefits: "4GB/day", description: "Ultimate annual" },

  // BSNL Plans (30 plans)
  { operator: "BSNL", type: "prepaid", amount: 18, validity: "1 day", benefits: "200MB data", description: "Daily pack" },
  { operator: "BSNL", type: "prepaid", amount: 36, validity: "2 days", benefits: "500MB data", description: "2-day pack" },
  { operator: "BSNL", type: "prepaid", amount: 54, validity: "3 days", benefits: "1GB data", description: "3-day pack" },
  { operator: "BSNL", type: "prepaid", amount: 72, validity: "7 days", benefits: "1GB/day", description: "Weekly pack" },
  { operator: "BSNL", type: "prepaid", amount: 90, validity: "10 days", benefits: "1GB/day", description: "10-day pack" },
  { operator: "BSNL", type: "prepaid", amount: 126, validity: "14 days", benefits: "1.5GB/day", description: "Fortnightly" },
  { operator: "BSNL", type: "prepaid", amount: 153, validity: "21 days", benefits: "1.5GB/day", description: "3-week pack" },
  { operator: "BSNL", type: "prepaid", amount: 187, validity: "28 days", benefits: "1GB/day", description: "Monthly basic" },
  { operator: "BSNL", type: "prepaid", amount: 197, validity: "28 days", benefits: "1.5GB/day", description: "Standard pack" },
  { operator: "BSNL", type: "prepaid", amount: 227, validity: "28 days", benefits: "2GB/day", description: "High data" },
  { operator: "BSNL", type: "prepaid", amount: 247, validity: "28 days", benefits: "2GB/day + calls", description: "Complete pack" },
  { operator: "BSNL", type: "prepaid", amount: 297, validity: "28 days", benefits: "2.5GB/day", description: "Premium pack" },
  { operator: "BSNL", type: "prepaid", amount: 327, validity: "28 days", benefits: "3GB/day", description: "Max pack" },
  { operator: "BSNL", type: "prepaid", amount: 347, validity: "28 days", benefits: "3GB/day + STD", description: "STD pack" },
  { operator: "BSNL", type: "prepaid", amount: 367, validity: "28 days", benefits: "3.5GB/day", description: "Super pack" },
  { operator: "BSNL", type: "prepaid", amount: 397, validity: "70 days", benefits: "2GB/day", description: "70-day pack" },
  { operator: "BSNL", type: "prepaid", amount: 447, validity: "70 days", benefits: "2.5GB/day", description: "70-day premium" },
  { operator: "BSNL", type: "prepaid", amount: 497, validity: "70 days", benefits: "3GB/day", description: "70-day max" },
  { operator: "BSNL", type: "prepaid", amount: 597, validity: "90 days", benefits: "2GB/day", description: "3-month pack" },
  { operator: "BSNL", type: "prepaid", amount: 697, validity: "90 days", benefits: "2.5GB/day", description: "3-month premium" },
  { operator: "BSNL", type: "prepaid", amount: 797, validity: "160 days", benefits: "2GB/day", description: "160-day pack" },
  { operator: "BSNL", type: "prepaid", amount: 897, validity: "160 days", benefits: "2.5GB/day", description: "160-day premium" },
  { operator: "BSNL", type: "prepaid", amount: 997, validity: "180 days", benefits: "2.5GB/day", description: "6-month pack" },
  { operator: "BSNL", type: "prepaid", amount: 1197, validity: "240 days", benefits: "2GB/day", description: "8-month pack" },
  { operator: "BSNL", type: "prepaid", amount: 1397, validity: "300 days", benefits: "2.5GB/day", description: "10-month pack" },
  { operator: "BSNL", type: "prepaid", amount: 1597, validity: "365 days", benefits: "2GB/day", description: "Annual basic" },
  { operator: "BSNL", type: "prepaid", amount: 1797, validity: "365 days", benefits: "2.5GB/day", description: "Annual standard" },
  { operator: "BSNL", type: "prepaid", amount: 1997, validity: "365 days", benefits: "3GB/day", description: "Annual premium" },
  { operator: "BSNL", type: "prepaid", amount: 2197, validity: "365 days", benefits: "3.5GB/day", description: "Annual max" },
  { operator: "BSNL", type: "prepaid", amount: 2397, validity: "365 days", benefits: "4GB/day", description: "Ultimate annual" }
];

const seedAllPlans = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/recharge-app');
    console.log('Connected to MongoDB');
    
    await Plan.deleteMany({});
    console.log('Cleared existing plans');
    
    await Plan.insertMany(plans);
    console.log(`Inserted ${plans.length} plans successfully`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding plans:', error);
    process.exit(1);
  }
};

seedAllPlans();