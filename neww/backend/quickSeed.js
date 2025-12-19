const mongoose = require('mongoose');
const Plan = require('./models/Plan');

const plans = [
  // Airtel Plans
  { planId: "AIR001", operator: "Airtel", amount: 19, validity: "1 day", benefits: ["200MB data"], description: "Emergency data pack", planType: "data" },
  { planId: "AIR002", operator: "Airtel", amount: 79, validity: "7 days", benefits: ["1GB/day", "Unlimited calls"], description: "Weekly pack", planType: "fulltt" },
  { planId: "AIR003", operator: "Airtel", amount: 179, validity: "28 days", benefits: ["1.5GB/day", "Unlimited calls", "100 SMS/day"], description: "Monthly starter", planType: "fulltt" },
  { planId: "AIR004", operator: "Airtel", amount: 199, validity: "28 days", benefits: ["1.5GB/day", "Unlimited calls", "100 SMS/day"], description: "Popular pack", planType: "fulltt" },
  { planId: "AIR005", operator: "Airtel", amount: 239, validity: "28 days", benefits: ["2GB/day", "Unlimited calls", "100 SMS/day"], description: "High data pack", planType: "fulltt" },
  { planId: "AIR006", operator: "Airtel", amount: 299, validity: "28 days", benefits: ["2.5GB/day", "Unlimited calls", "100 SMS/day"], description: "Premium pack", planType: "fulltt" },
  { planId: "AIR007", operator: "Airtel", amount: 359, validity: "28 days", benefits: ["3GB/day", "Unlimited calls", "100 SMS/day"], description: "Heavy user pack", planType: "fulltt" },
  { planId: "AIR008", operator: "Airtel", amount: 399, validity: "56 days", benefits: ["2GB/day", "Unlimited calls", "100 SMS/day"], description: "2-month pack", planType: "fulltt" },
  { planId: "AIR009", operator: "Airtel", amount: 449, validity: "56 days", benefits: ["2.5GB/day", "Unlimited calls", "100 SMS/day"], description: "Extended validity", planType: "fulltt" },
  { planId: "AIR010", operator: "Airtel", amount: 599, validity: "84 days", benefits: ["2GB/day", "Unlimited calls", "100 SMS/day"], description: "Quarterly pack", planType: "fulltt" },
  { planId: "AIR011", operator: "Airtel", amount: 699, validity: "84 days", benefits: ["2.5GB/day", "Unlimited calls", "100 SMS/day"], description: "Premium quarterly", planType: "fulltt" },
  { planId: "AIR012", operator: "Airtel", amount: 999, validity: "120 days", benefits: ["2.5GB/day", "Unlimited calls", "100 SMS/day"], description: "4-month pack", planType: "fulltt" },
  { planId: "AIR013", operator: "Airtel", amount: 1499, validity: "180 days", benefits: ["3GB/day", "Unlimited calls", "100 SMS/day"], description: "6-month pack", planType: "fulltt" },
  { planId: "AIR014", operator: "Airtel", amount: 2399, validity: "365 days", benefits: ["2GB/day", "Unlimited calls", "100 SMS/day"], description: "Annual pack", planType: "fulltt" },
  { planId: "AIR015", operator: "Airtel", amount: 2999, validity: "365 days", benefits: ["2.5GB/day", "Unlimited calls", "100 SMS/day"], description: "Premium annual", planType: "fulltt" },
  { planId: "AIR016", operator: "Airtel", amount: 49, validity: "3 days", benefits: ["1GB data"], description: "Short term pack", planType: "data" },
  { planId: "AIR017", operator: "Airtel", amount: 65, validity: "4 days", benefits: ["1.5GB data"], description: "Extended pack", planType: "data" },
  { planId: "AIR018", operator: "Airtel", amount: 95, validity: "10 days", benefits: ["1GB/day"], description: "10-day pack", planType: "data" },
  { planId: "AIR019", operator: "Airtel", amount: 129, validity: "14 days", benefits: ["1GB/day"], description: "Fortnightly pack", planType: "data" },
  { planId: "AIR020", operator: "Airtel", amount: 155, validity: "24 days", benefits: ["1GB/day"], description: "24-day pack", planType: "data" },
  { planId: "AIR021", operator: "Airtel", amount: 265, validity: "28 days", benefits: ["2GB/day", "Disney+ Hotstar"], description: "Entertainment pack", planType: "fulltt" },
  { planId: "AIR022", operator: "Airtel", amount: 319, validity: "30 days", benefits: ["2.5GB/day", "Unlimited calls"], description: "30-day pack", planType: "fulltt" },
  { planId: "AIR023", operator: "Airtel", amount: 479, validity: "56 days", benefits: ["3GB/day", "Unlimited calls"], description: "Long term pack", planType: "fulltt" },
  { planId: "AIR024", operator: "Airtel", amount: 549, validity: "70 days", benefits: ["2GB/day", "Unlimited calls"], description: "70-day pack", planType: "fulltt" },
  { planId: "AIR025", operator: "Airtel", amount: 799, validity: "90 days", benefits: ["3GB/day", "Unlimited calls"], description: "90-day pack", planType: "fulltt" },
  { planId: "AIR026", operator: "Airtel", amount: 1199, validity: "150 days", benefits: ["3GB/day", "Unlimited calls"], description: "5-month pack", planType: "fulltt" },
  { planId: "AIR027", operator: "Airtel", amount: 1799, validity: "240 days", benefits: ["2.5GB/day", "Unlimited calls"], description: "8-month pack", planType: "fulltt" },
  { planId: "AIR028", operator: "Airtel", amount: 3359, validity: "365 days", benefits: ["3GB/day", "Unlimited calls"], description: "Ultimate annual", planType: "fulltt" },
  { planId: "AIR029", operator: "Airtel", amount: 3999, validity: "365 days", benefits: ["4GB/day", "Unlimited calls"], description: "Max annual", planType: "fulltt" },
  { planId: "AIR030", operator: "Airtel", amount: 29, validity: "2 days", benefits: ["500MB data"], description: "Weekend pack", planType: "data" },

  // Jio Plans
  { planId: "JIO001", operator: "Jio", amount: 22, validity: "1 day", benefits: ["200MB data"], description: "Daily booster", planType: "data" },
  { planId: "JIO002", operator: "Jio", amount: 69, validity: "7 days", benefits: ["1GB/day", "Unlimited calls"], description: "Weekly pack", planType: "fulltt" },
  { planId: "JIO003", operator: "Jio", amount: 179, validity: "28 days", benefits: ["1.5GB/day", "Unlimited calls", "100 SMS/day"], description: "Monthly basic", planType: "fulltt" },
  { planId: "JIO004", operator: "Jio", amount: 209, validity: "28 days", benefits: ["1.5GB/day", "JioApps", "Unlimited calls"], description: "App bundle", planType: "fulltt" },
  { planId: "JIO005", operator: "Jio", amount: 239, validity: "28 days", benefits: ["2GB/day", "Unlimited calls", "100 SMS/day"], description: "Standard pack", planType: "fulltt" },
  { planId: "JIO006", operator: "Jio", amount: 269, validity: "28 days", benefits: ["2GB/day", "JioCinema", "Unlimited calls"], description: "Entertainment", planType: "fulltt" },
  { planId: "JIO007", operator: "Jio", amount: 299, validity: "28 days", benefits: ["2.5GB/day", "Unlimited calls", "100 SMS/day"], description: "High data", planType: "fulltt" },
  { planId: "JIO008", operator: "Jio", amount: 329, validity: "28 days", benefits: ["2.5GB/day", "Netflix", "Unlimited calls"], description: "Netflix bundle", planType: "fulltt" },
  { planId: "JIO009", operator: "Jio", amount: 349, validity: "28 days", benefits: ["3GB/day", "Unlimited calls", "100 SMS/day"], description: "Premium pack", planType: "fulltt" },
  { planId: "JIO010", operator: "Jio", amount: 399, validity: "56 days", benefits: ["2GB/day", "Unlimited calls", "100 SMS/day"], description: "2-month basic", planType: "fulltt" },
  { planId: "JIO011", operator: "Jio", amount: 479, validity: "56 days", benefits: ["2.5GB/day", "Unlimited calls", "100 SMS/day"], description: "2-month premium", planType: "fulltt" },
  { planId: "JIO012", operator: "Jio", amount: 599, validity: "84 days", benefits: ["2GB/day", "Unlimited calls", "100 SMS/day"], description: "3-month pack", planType: "fulltt" },
  { planId: "JIO013", operator: "Jio", amount: 719, validity: "84 days", benefits: ["2.5GB/day", "Unlimited calls", "100 SMS/day"], description: "3-month premium", planType: "fulltt" },
  { planId: "JIO014", operator: "Jio", amount: 999, validity: "120 days", benefits: ["2.5GB/day", "Unlimited calls", "100 SMS/day"], description: "4-month pack", planType: "fulltt" },
  { planId: "JIO015", operator: "Jio", amount: 1559, validity: "180 days", benefits: ["3GB/day", "Unlimited calls", "100 SMS/day"], description: "6-month pack", planType: "fulltt" },
  { planId: "JIO016", operator: "Jio", amount: 2879, validity: "365 days", benefits: ["2.5GB/day", "Unlimited calls", "100 SMS/day"], description: "Annual pack", planType: "fulltt" },
  { planId: "JIO017", operator: "Jio", amount: 39, validity: "2 days", benefits: ["500MB data"], description: "Weekend special", planType: "data" },
  { planId: "JIO018", operator: "Jio", amount: 52, validity: "3 days", benefits: ["1GB data"], description: "3-day pack", planType: "data" },
  { planId: "JIO019", operator: "Jio", amount: 89, validity: "10 days", benefits: ["1GB/day"], description: "10-day special", planType: "data" },
  { planId: "JIO020", operator: "Jio", amount: 119, validity: "14 days", benefits: ["1GB/day"], description: "2-week pack", planType: "data" },
  { planId: "JIO021", operator: "Jio", amount: 149, validity: "20 days", benefits: ["1.5GB/day"], description: "20-day pack", planType: "data" },
  { planId: "JIO022", operator: "Jio", amount: 379, validity: "28 days", benefits: ["3GB/day", "JioApps"], description: "All-in-one", planType: "fulltt" },
  { planId: "JIO023", operator: "Jio", amount: 533, validity: "56 days", benefits: ["3GB/day", "Unlimited calls"], description: "2-month max", planType: "fulltt" },
  { planId: "JIO024", operator: "Jio", amount: 799, validity: "84 days", benefits: ["3GB/day", "Unlimited calls"], description: "3-month max", planType: "fulltt" },
  { planId: "JIO025", operator: "Jio", amount: 1299, validity: "150 days", benefits: ["3GB/day", "Unlimited calls"], description: "5-month pack", planType: "fulltt" },
  { planId: "JIO026", operator: "Jio", amount: 1899, validity: "240 days", benefits: ["2.5GB/day", "Unlimited calls"], description: "8-month pack", planType: "fulltt" },
  { planId: "JIO027", operator: "Jio", amount: 2545, validity: "336 days", benefits: ["2.5GB/day", "Unlimited calls"], description: "11-month pack", planType: "fulltt" },
  { planId: "JIO028", operator: "Jio", amount: 3119, validity: "365 days", benefits: ["3GB/day", "Unlimited calls"], description: "Annual premium", planType: "fulltt" },
  { planId: "JIO029", operator: "Jio", amount: 3599, validity: "365 days", benefits: ["3.5GB/day", "Unlimited calls"], description: "Annual max", planType: "fulltt" },
  { planId: "JIO030", operator: "Jio", amount: 4199, validity: "365 days", benefits: ["4GB/day", "Unlimited calls"], description: "Ultimate annual", planType: "fulltt" },

  // Vi Plans
  { planId: "VI001", operator: "Vi", amount: 24, validity: "1 day", benefits: ["200MB data"], description: "Emergency pack", planType: "data" },
  { planId: "VI002", operator: "Vi", amount: 79, validity: "7 days", benefits: ["1GB/day", "Unlimited calls"], description: "Weekly pack", planType: "fulltt" },
  { planId: "VI003", operator: "Vi", amount: 199, validity: "28 days", benefits: ["1.5GB/day", "Unlimited calls", "100 SMS/day"], description: "Monthly starter", planType: "fulltt" },
  { planId: "VI004", operator: "Vi", amount: 219, validity: "28 days", benefits: ["1.5GB/day", "Unlimited calls", "100 SMS/day"], description: "Standard pack", planType: "fulltt" },
  { planId: "VI005", operator: "Vi", amount: 249, validity: "28 days", benefits: ["2GB/day", "Unlimited calls", "100 SMS/day"], description: "High data", planType: "fulltt" },
  { planId: "VI006", operator: "Vi", amount: 279, validity: "28 days", benefits: ["2GB/day", "Vi Movies & TV", "Unlimited calls"], description: "Entertainment", planType: "fulltt" },
  { planId: "VI007", operator: "Vi", amount: 319, validity: "28 days", benefits: ["2.5GB/day", "Unlimited calls", "100 SMS/day"], description: "Premium pack", planType: "fulltt" },
  { planId: "VI008", operator: "Vi", amount: 359, validity: "28 days", benefits: ["3GB/day", "Unlimited calls", "100 SMS/day"], description: "Max pack", planType: "fulltt" },
  { planId: "VI009", operator: "Vi", amount: 449, validity: "56 days", benefits: ["2GB/day", "Unlimited calls", "100 SMS/day"], description: "2-month basic", planType: "fulltt" },
  { planId: "VI010", operator: "Vi", amount: 519, validity: "56 days", benefits: ["2.5GB/day", "Unlimited calls", "100 SMS/day"], description: "2-month premium", planType: "fulltt" },
  { planId: "VI011", operator: "Vi", amount: 699, validity: "84 days", benefits: ["2GB/day", "Unlimited calls", "100 SMS/day"], description: "3-month pack", planType: "fulltt" },
  { planId: "VI012", operator: "Vi", amount: 799, validity: "84 days", benefits: ["2.5GB/day", "Unlimited calls", "100 SMS/day"], description: "3-month premium", planType: "fulltt" },
  { planId: "VI013", operator: "Vi", amount: 1099, validity: "120 days", benefits: ["2.5GB/day", "Unlimited calls", "100 SMS/day"], description: "4-month pack", planType: "fulltt" },
  { planId: "VI014", operator: "Vi", amount: 1699, validity: "180 days", benefits: ["3GB/day", "Unlimited calls", "100 SMS/day"], description: "6-month pack", planType: "fulltt" },
  { planId: "VI015", operator: "Vi", amount: 2999, validity: "365 days", benefits: ["2.5GB/day", "Unlimited calls", "100 SMS/day"], description: "Annual pack", planType: "fulltt" },
  { planId: "VI016", operator: "Vi", amount: 44, validity: "2 days", benefits: ["500MB data"], description: "2-day pack", planType: "data" },
  { planId: "VI017", operator: "Vi", amount: 58, validity: "3 days", benefits: ["1GB data"], description: "3-day special", planType: "data" },
  { planId: "VI018", operator: "Vi", amount: 99, validity: "10 days", benefits: ["1GB/day"], description: "10-day pack", planType: "data" },
  { planId: "VI019", operator: "Vi", amount: 139, validity: "14 days", benefits: ["1.5GB/day"], description: "Fortnightly", planType: "data" },
  { planId: "VI020", operator: "Vi", amount: 169, validity: "21 days", benefits: ["1.5GB/day"], description: "3-week pack", planType: "data" },
  { planId: "VI021", operator: "Vi", amount: 379, validity: "28 days", benefits: ["3GB/day", "Vi Movies & TV"], description: "Ultimate pack", planType: "fulltt" },
  { planId: "VI022", operator: "Vi", amount: 399, validity: "28 days", benefits: ["3.5GB/day", "Unlimited calls"], description: "Super pack", planType: "fulltt" },
  { planId: "VI023", operator: "Vi", amount: 599, validity: "56 days", benefits: ["3GB/day", "Unlimited calls"], description: "2-month max", planType: "fulltt" },
  { planId: "VI024", operator: "Vi", amount: 899, validity: "84 days", benefits: ["3GB/day", "Unlimited calls"], description: "3-month max", planType: "fulltt" },
  { planId: "VI025", operator: "Vi", amount: 1399, validity: "150 days", benefits: ["3GB/day", "Unlimited calls"], description: "5-month pack", planType: "fulltt" },
  { planId: "VI026", operator: "Vi", amount: 2099, validity: "240 days", benefits: ["2.5GB/day", "Unlimited calls"], description: "8-month pack", planType: "fulltt" },
  { planId: "VI027", operator: "Vi", amount: 2699, validity: "336 days", benefits: ["2.5GB/day", "Unlimited calls"], description: "11-month pack", planType: "fulltt" },
  { planId: "VI028", operator: "Vi", amount: 3299, validity: "365 days", benefits: ["3GB/day", "Unlimited calls"], description: "Annual premium", planType: "fulltt" },
  { planId: "VI029", operator: "Vi", amount: 3799, validity: "365 days", benefits: ["3.5GB/day", "Unlimited calls"], description: "Annual max", planType: "fulltt" },
  { planId: "VI030", operator: "Vi", amount: 4399, validity: "365 days", benefits: ["4GB/day", "Unlimited calls"], description: "Ultimate annual", planType: "fulltt" },

  // BSNL Plans
  { planId: "BSN001", operator: "BSNL", amount: 18, validity: "1 day", benefits: ["200MB data"], description: "Daily pack", planType: "data" },
  { planId: "BSN002", operator: "BSNL", amount: 72, validity: "7 days", benefits: ["1GB/day", "Unlimited calls"], description: "Weekly pack", planType: "fulltt" },
  { planId: "BSN003", operator: "BSNL", amount: 187, validity: "28 days", benefits: ["1GB/day", "Unlimited calls", "100 SMS/day"], description: "Monthly basic", planType: "fulltt" },
  { planId: "BSN004", operator: "BSNL", amount: 197, validity: "28 days", benefits: ["1.5GB/day", "Unlimited calls", "100 SMS/day"], description: "Standard pack", planType: "fulltt" },
  { planId: "BSN005", operator: "BSNL", amount: 227, validity: "28 days", benefits: ["2GB/day", "Unlimited calls", "100 SMS/day"], description: "High data", planType: "fulltt" },
  { planId: "BSN006", operator: "BSNL", amount: 247, validity: "28 days", benefits: ["2GB/day", "Unlimited calls", "STD calls"], description: "Complete pack", planType: "fulltt" },
  { planId: "BSN007", operator: "BSNL", amount: 297, validity: "28 days", benefits: ["2.5GB/day", "Unlimited calls", "100 SMS/day"], description: "Premium pack", planType: "fulltt" },
  { planId: "BSN008", operator: "BSNL", amount: 327, validity: "28 days", benefits: ["3GB/day", "Unlimited calls", "100 SMS/day"], description: "Max pack", planType: "fulltt" },
  { planId: "BSN009", operator: "BSNL", amount: 397, validity: "70 days", benefits: ["2GB/day", "Unlimited calls", "100 SMS/day"], description: "70-day pack", planType: "fulltt" },
  { planId: "BSN010", operator: "BSNL", amount: 447, validity: "70 days", benefits: ["2.5GB/day", "Unlimited calls", "100 SMS/day"], description: "70-day premium", planType: "fulltt" },
  { planId: "BSN011", operator: "BSNL", amount: 597, validity: "90 days", benefits: ["2GB/day", "Unlimited calls", "100 SMS/day"], description: "3-month pack", planType: "fulltt" },
  { planId: "BSN012", operator: "BSNL", amount: 797, validity: "160 days", benefits: ["2GB/day", "Unlimited calls", "100 SMS/day"], description: "160-day pack", planType: "fulltt" },
  { planId: "BSN013", operator: "BSNL", amount: 997, validity: "180 days", benefits: ["2.5GB/day", "Unlimited calls", "100 SMS/day"], description: "6-month pack", planType: "fulltt" },
  { planId: "BSN014", operator: "BSNL", amount: 1597, validity: "365 days", benefits: ["2GB/day", "Unlimited calls", "100 SMS/day"], description: "Annual basic", planType: "fulltt" },
  { planId: "BSN015", operator: "BSNL", amount: 1997, validity: "365 days", benefits: ["3GB/day", "Unlimited calls", "100 SMS/day"], description: "Annual premium", planType: "fulltt" },
  { planId: "BSN016", operator: "BSNL", amount: 36, validity: "2 days", benefits: ["500MB data"], description: "2-day pack", planType: "data" },
  { planId: "BSN017", operator: "BSNL", amount: 54, validity: "3 days", benefits: ["1GB data"], description: "3-day pack", planType: "data" },
  { planId: "BSN018", operator: "BSNL", amount: 90, validity: "10 days", benefits: ["1GB/day"], description: "10-day pack", planType: "data" },
  { planId: "BSN019", operator: "BSNL", amount: 126, validity: "14 days", benefits: ["1.5GB/day"], description: "Fortnightly", planType: "data" },
  { planId: "BSN020", operator: "BSNL", amount: 153, validity: "21 days", benefits: ["1.5GB/day"], description: "3-week pack", planType: "data" },
  { planId: "BSN021", operator: "BSNL", amount: 347, validity: "28 days", benefits: ["3GB/day", "STD calls"], description: "STD pack", planType: "fulltt" },
  { planId: "BSN022", operator: "BSNL", amount: 367, validity: "28 days", benefits: ["3.5GB/day", "Unlimited calls"], description: "Super pack", planType: "fulltt" },
  { planId: "BSN023", operator: "BSNL", amount: 497, validity: "70 days", benefits: ["3GB/day", "Unlimited calls"], description: "70-day max", planType: "fulltt" },
  { planId: "BSN024", operator: "BSNL", amount: 697, validity: "90 days", benefits: ["2.5GB/day", "Unlimited calls"], description: "3-month premium", planType: "fulltt" },
  { planId: "BSN025", operator: "BSNL", amount: 897, validity: "160 days", benefits: ["2.5GB/day", "Unlimited calls"], description: "160-day premium", planType: "fulltt" },
  { planId: "BSN026", operator: "BSNL", amount: 1197, validity: "240 days", benefits: ["2GB/day", "Unlimited calls"], description: "8-month pack", planType: "fulltt" },
  { planId: "BSN027", operator: "BSNL", amount: 1397, validity: "300 days", benefits: ["2.5GB/day", "Unlimited calls"], description: "10-month pack", planType: "fulltt" },
  { planId: "BSN028", operator: "BSNL", amount: 1797, validity: "365 days", benefits: ["2.5GB/day", "Unlimited calls"], description: "Annual standard", planType: "fulltt" },
  { planId: "BSN029", operator: "BSNL", amount: 2197, validity: "365 days", benefits: ["3.5GB/day", "Unlimited calls"], description: "Annual max", planType: "fulltt" },
  { planId: "BSN030", operator: "BSNL", amount: 2397, validity: "365 days", benefits: ["4GB/day", "Unlimited calls"], description: "Ultimate annual", planType: "fulltt" }
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