const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get recharge plans
router.get('/plans/:operator', async (req, res) => {
  try {
    const { operator } = req.params;
    
    const plans = {
      airtel_prepaid: [
        // Full Talktime Plans (15 plans)
        { planId: "AIR_155", amount: 155, validity: "24 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day"], planType: "fulltt" },
        { planId: "AIR_179", amount: 179, validity: "28 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day"], planType: "fulltt" },
        { planId: "AIR_199", amount: 199, validity: "24 days", description: "Unlimited calls + 1.5GB/day", benefits: ["Unlimited Voice", "1.5GB Data/day", "100 SMS/day", "Wynk Music"], planType: "fulltt" },
        { planId: "AIR_265", amount: 265, validity: "28 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day"], planType: "fulltt" },
        { planId: "AIR_299", amount: 299, validity: "28 days", description: "Unlimited calls + 1.5GB/day", benefits: ["Unlimited Voice", "1.5GB Data/day", "100 SMS/day", "Airtel Thanks"], planType: "fulltt" },
        { planId: "AIR_359", amount: 359, validity: "28 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "Disney+ Hotstar Mobile"], planType: "fulltt" },
        { planId: "AIR_399", amount: 399, validity: "28 days", description: "Unlimited calls + 2.5GB/day", benefits: ["Unlimited Voice", "2.5GB Data/day", "100 SMS/day", "Disney+ Hotstar Mobile", "Wynk Music"], planType: "fulltt" },
        { planId: "AIR_449", amount: 449, validity: "56 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day"], planType: "fulltt" },
        { planId: "AIR_549", amount: 549, validity: "56 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "Disney+ Hotstar Mobile"], planType: "fulltt" },
        { planId: "AIR_599", amount: 599, validity: "56 days", description: "Unlimited calls + 2.5GB/day", benefits: ["Unlimited Voice", "2.5GB Data/day", "100 SMS/day", "Disney+ Hotstar Mobile", "Wynk Music"], planType: "fulltt" },
        { planId: "AIR_719", amount: 719, validity: "84 days", description: "Unlimited calls + 1.5GB/day", benefits: ["Unlimited Voice", "1.5GB Data/day", "100 SMS/day"], planType: "fulltt" },
        { planId: "AIR_839", amount: 839, validity: "84 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "Disney+ Hotstar Mobile"], planType: "fulltt" },
        { planId: "AIR_999", amount: 999, validity: "84 days", description: "Unlimited calls + 2.5GB/day", benefits: ["Unlimited Voice", "2.5GB Data/day", "100 SMS/day", "Disney+ Hotstar Mobile", "Amazon Prime"], planType: "fulltt" },
        { planId: "AIR_1799", amount: 1799, validity: "365 days", description: "Unlimited calls + 24GB/month", benefits: ["Unlimited Voice", "24GB Data/month", "100 SMS/day", "Disney+ Hotstar Mobile"], planType: "fulltt" },
        { planId: "AIR_2999", amount: 2999, validity: "365 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "Disney+ Hotstar Mobile", "Amazon Prime"], planType: "fulltt" },
        
        // Data Only Plans (12 plans)
        { planId: "AIR_D19", amount: 19, validity: "1 day", description: "1GB Data", benefits: ["1GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "AIR_D25", amount: 25, validity: "2 days", description: "1.5GB Data", benefits: ["1.5GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "AIR_D48", amount: 48, validity: "3 days", description: "3GB Data", benefits: ["3GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "AIR_D65", amount: 65, validity: "7 days", description: "4GB Data", benefits: ["4GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "AIR_D98", amount: 98, validity: "28 days", description: "6GB Data", benefits: ["6GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "AIR_D118", amount: 118, validity: "28 days", description: "12GB Data", benefits: ["12GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "AIR_D155", amount: 155, validity: "30 days", description: "15GB Data", benefits: ["15GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "AIR_D181", amount: 181, validity: "30 days", description: "40GB Data", benefits: ["40GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "AIR_D301", amount: 301, validity: "30 days", description: "50GB Data", benefits: ["50GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "AIR_D401", amount: 401, validity: "30 days", description: "75GB Data", benefits: ["75GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "AIR_D501", amount: 501, validity: "30 days", description: "100GB Data", benefits: ["100GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "AIR_D601", amount: 601, validity: "30 days", description: "120GB Data", benefits: ["120GB Data", "No Voice/SMS"], planType: "data" },
        
        // Top-up Plans (8 plans)
        { planId: "AIR_T10", amount: 10, validity: "1 day", description: "Quick Top-up", benefits: ["₹7.5 Talk Time", "Local/STD Calls"], planType: "topup" },
        { planId: "AIR_T20", amount: 20, validity: "2 days", description: "Mini Top-up", benefits: ["₹15 Talk Time", "100MB Data"], planType: "topup" },
        { planId: "AIR_T30", amount: 30, validity: "3 days", description: "Smart Top-up", benefits: ["₹22 Talk Time", "200MB Data"], planType: "topup" },
        { planId: "AIR_T50", amount: 50, validity: "7 days", description: "Weekly Top-up", benefits: ["₹38 Talk Time", "500MB Data"], planType: "topup" },
        { planId: "AIR_T100", amount: 100, validity: "14 days", description: "Fortnightly Top-up", benefits: ["₹80 Talk Time", "1GB Data"], planType: "topup" },
        { planId: "AIR_T200", amount: 200, validity: "28 days", description: "Monthly Top-up", benefits: ["₹165 Talk Time", "2GB Data"], planType: "topup" },
        { planId: "AIR_T500", amount: 500, validity: "56 days", description: "Mega Top-up", benefits: ["₹425 Talk Time", "5GB Data"], planType: "topup" },
        { planId: "AIR_T1000", amount: 1000, validity: "84 days", description: "Super Top-up", benefits: ["₹875 Talk Time", "10GB Data"], planType: "topup" }
      ],
      jio_prepaid: [
        // Full Talktime Plans (14 plans)
        { planId: "JIO_155", amount: 155, validity: "24 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "JioApps"], planType: "fulltt" },
        { planId: "JIO_179", amount: 179, validity: "28 days", description: "Unlimited calls + 1.5GB/day", benefits: ["Unlimited Voice", "1.5GB Data/day", "100 SMS/day", "JioApps"], planType: "fulltt" },
        { planId: "JIO_209", amount: 209, validity: "28 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day", "JioApps"], planType: "fulltt" },
        { planId: "JIO_239", amount: 239, validity: "28 days", description: "Unlimited calls + 1.5GB/day", benefits: ["Unlimited Voice", "1.5GB Data/day", "100 SMS/day", "JioApps"], planType: "fulltt" },
        { planId: "JIO_299", amount: 299, validity: "28 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "JioApps"], planType: "fulltt" },
        { planId: "JIO_349", amount: 349, validity: "28 days", description: "Unlimited calls + 2.5GB/day", benefits: ["Unlimited Voice", "2.5GB Data/day", "100 SMS/day", "JioApps", "Netflix Mobile"], planType: "fulltt" },
        { planId: "JIO_395", amount: 395, validity: "84 days", description: "Unlimited calls + 6GB total", benefits: ["Unlimited Voice", "6GB Total Data", "1000 SMS", "JioApps"], planType: "fulltt" },
        { planId: "JIO_533", amount: 533, validity: "56 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "JioApps"], planType: "fulltt" },
        { planId: "JIO_666", amount: 666, validity: "84 days", description: "Unlimited calls + 1.5GB/day", benefits: ["Unlimited Voice", "1.5GB Data/day", "100 SMS/day", "JioApps"], planType: "fulltt" },
        { planId: "JIO_719", amount: 719, validity: "84 days", description: "Unlimited calls + 1.5GB/day", benefits: ["Unlimited Voice", "1.5GB Data/day", "100 SMS/day", "JioApps"], planType: "fulltt" },
        { planId: "JIO_999", amount: 999, validity: "84 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "JioApps", "Netflix Mobile"], planType: "fulltt" },
        { planId: "JIO_1559", amount: 1559, validity: "336 days", description: "Unlimited calls + 24GB/month", benefits: ["Unlimited Voice", "24GB Data/month", "3600 SMS", "JioApps"], planType: "fulltt" },
        { planId: "JIO_2999", amount: 2999, validity: "365 days", description: "Unlimited calls + 2.5GB/day", benefits: ["Unlimited Voice", "2.5GB Data/day", "100 SMS/day", "JioApps", "Netflix Mobile"], planType: "fulltt" },
        { planId: "JIO_4199", amount: 4199, validity: "365 days", description: "Unlimited calls + 3GB/day", benefits: ["Unlimited Voice", "3GB Data/day", "100 SMS/day", "JioApps", "Netflix Premium"], planType: "fulltt" },
        
        // Data Only Plans (10 plans)
        { planId: "JIO_D15", amount: 15, validity: "1 day", description: "1GB Data", benefits: ["1GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "JIO_D25", amount: 25, validity: "2 days", description: "1.5GB Data", benefits: ["1.5GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "JIO_D39", amount: 39, validity: "7 days", description: "2.5GB Data", benefits: ["2.5GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "JIO_D69", amount: 69, validity: "28 days", description: "6GB Data", benefits: ["6GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "JIO_D99", amount: 99, validity: "28 days", description: "10GB Data", benefits: ["10GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "JIO_D149", amount: 149, validity: "30 days", description: "12GB Data", benefits: ["12GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "JIO_D199", amount: 199, validity: "30 days", description: "25GB Data", benefits: ["25GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "JIO_D299", amount: 299, validity: "30 days", description: "50GB Data", benefits: ["50GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "JIO_D399", amount: 399, validity: "30 days", description: "75GB Data", benefits: ["75GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "JIO_D499", amount: 499, validity: "30 days", description: "100GB Data", benefits: ["100GB Data", "No Voice/SMS"], planType: "data" },
        
        // Top-up Plans (8 plans)
        { planId: "JIO_T11", amount: 11, validity: "1 day", description: "Quick Top-up", benefits: ["₹8 Talk Time", "JioApps Access"], planType: "topup" },
        { planId: "JIO_T22", amount: 22, validity: "2 days", description: "Mini Top-up", benefits: ["₹18 Talk Time", "150MB Data"], planType: "topup" },
        { planId: "JIO_T33", amount: 33, validity: "3 days", description: "Smart Top-up", benefits: ["₹28 Talk Time", "300MB Data"], planType: "topup" },
        { planId: "JIO_T55", amount: 55, validity: "7 days", description: "Weekly Top-up", benefits: ["₹45 Talk Time", "600MB Data"], planType: "topup" },
        { planId: "JIO_T110", amount: 110, validity: "14 days", description: "Fortnightly Top-up", benefits: ["₹95 Talk Time", "1.2GB Data"], planType: "topup" },
        { planId: "JIO_T220", amount: 220, validity: "28 days", description: "Monthly Top-up", benefits: ["₹190 Talk Time", "2.5GB Data"], planType: "topup" },
        { planId: "JIO_T550", amount: 550, validity: "56 days", description: "Mega Top-up", benefits: ["₹480 Talk Time", "6GB Data"], planType: "topup" },
        { planId: "JIO_T1100", amount: 1100, validity: "84 days", description: "Super Top-up", benefits: ["₹980 Talk Time", "12GB Data"], planType: "topup" }
      ],
      vi_prepaid: [
        // Full Talktime Plans (12 plans)
        { planId: "VI_155", amount: 155, validity: "24 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day"], planType: "fulltt" },
        { planId: "VI_179", amount: 179, validity: "28 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day"], planType: "fulltt" },
        { planId: "VI_219", amount: 219, validity: "28 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day", "Vi Movies & TV"], planType: "fulltt" },
        { planId: "VI_269", amount: 269, validity: "28 days", description: "Unlimited calls + 1.5GB/day", benefits: ["Unlimited Voice", "1.5GB Data/day", "100 SMS/day"], planType: "fulltt" },
        { planId: "VI_319", amount: 319, validity: "28 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "Binge All Night"], planType: "fulltt" },
        { planId: "VI_359", amount: 359, validity: "28 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "Weekend Data Rollover"], planType: "fulltt" },
        { planId: "VI_449", amount: 449, validity: "56 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day"], planType: "fulltt" },
        { planId: "VI_539", amount: 539, validity: "56 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day"], planType: "fulltt" },
        { planId: "VI_699", amount: 699, validity: "84 days", description: "Unlimited calls + 1.5GB/day", benefits: ["Unlimited Voice", "1.5GB Data/day", "100 SMS/day"], planType: "fulltt" },
        { planId: "VI_859", amount: 859, validity: "84 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "Weekend Data Rollover"], planType: "fulltt" },
        { planId: "VI_1799", amount: 1799, validity: "365 days", description: "Unlimited calls + 24GB/month", benefits: ["Unlimited Voice", "24GB Data/month", "100 SMS/day", "Vi Movies & TV"], planType: "fulltt" },
        { planId: "VI_2899", amount: 2899, validity: "365 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "Vi Movies & TV", "Netflix Mobile"], planType: "fulltt" },
        
        // Data Only Plans (9 plans)
        { planId: "VI_D16", amount: 16, validity: "1 day", description: "1GB Data", benefits: ["1GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "VI_D29", amount: 29, validity: "2 days", description: "2GB Data", benefits: ["2GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "VI_D48", amount: 48, validity: "7 days", description: "3GB Data", benefits: ["3GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "VI_D58", amount: 58, validity: "28 days", description: "3GB Data", benefits: ["3GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "VI_D118", amount: 118, validity: "28 days", description: "12GB Data", benefits: ["12GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "VI_D181", amount: 181, validity: "30 days", description: "30GB Data", benefits: ["30GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "VI_D301", amount: 301, validity: "30 days", description: "50GB Data", benefits: ["50GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "VI_D401", amount: 401, validity: "30 days", description: "75GB Data", benefits: ["75GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "VI_D501", amount: 501, validity: "30 days", description: "100GB Data", benefits: ["100GB Data", "No Voice/SMS"], planType: "data" },
        
        // Top-up Plans (7 plans)
        { planId: "VI_T10", amount: 10, validity: "1 day", description: "Quick Top-up", benefits: ["₹7 Talk Time", "Local Calls"], planType: "topup" },
        { planId: "VI_T20", amount: 20, validity: "2 days", description: "Mini Top-up", benefits: ["₹16 Talk Time", "120MB Data"], planType: "topup" },
        { planId: "VI_T30", amount: 30, validity: "3 days", description: "Smart Top-up", benefits: ["₹25 Talk Time", "250MB Data"], planType: "topup" },
        { planId: "VI_T50", amount: 50, validity: "7 days", description: "Weekly Top-up", benefits: ["₹42 Talk Time", "550MB Data"], planType: "topup" },
        { planId: "VI_T100", amount: 100, validity: "14 days", description: "Fortnightly Top-up", benefits: ["₹85 Talk Time", "1.1GB Data"], planType: "topup" },
        { planId: "VI_T200", amount: 200, validity: "28 days", description: "Monthly Top-up", benefits: ["₹175 Talk Time", "2.2GB Data"], planType: "topup" },
        { planId: "VI_T500", amount: 500, validity: "56 days", description: "Mega Top-up", benefits: ["₹450 Talk Time", "5.5GB Data"], planType: "topup" }
      ],
      bsnl_prepaid: [
        // Full Talktime Plans (10 plans)
        { planId: "BSNL_108", amount: 108, validity: "25 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day"], planType: "fulltt" },
        { planId: "BSNL_187", amount: 187, validity: "28 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day"], planType: "fulltt" },
        { planId: "BSNL_247", amount: 247, validity: "45 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day"], planType: "fulltt" },
        { planId: "BSNL_297", amount: 297, validity: "54 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day"], planType: "fulltt" },
        { planId: "BSNL_397", amount: 397, validity: "80 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day"], planType: "fulltt" },
        { planId: "BSNL_499", amount: 499, validity: "90 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day"], planType: "fulltt" },
        { planId: "BSNL_666", amount: 666, validity: "160 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day"], planType: "fulltt" },
        { planId: "BSNL_997", amount: 997, validity: "180 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day"], planType: "fulltt" },
        { planId: "BSNL_1999", amount: 1999, validity: "365 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day"], planType: "fulltt" },
        { planId: "BSNL_2399", amount: 2399, validity: "365 days", description: "Unlimited calls + 3GB/day", benefits: ["Unlimited Voice", "3GB Data/day", "100 SMS/day"], planType: "fulltt" },
        
        // Data Only Plans (8 plans)
        { planId: "BSNL_D17", amount: 17, validity: "1 day", description: "1GB Data", benefits: ["1GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "BSNL_D22", amount: 22, validity: "2 days", description: "1GB Data", benefits: ["1GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "BSNL_D47", amount: 47, validity: "30 days", description: "2GB Data", benefits: ["2GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "BSNL_D97", amount: 97, validity: "30 days", description: "10GB Data", benefits: ["10GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "BSNL_D147", amount: 147, validity: "30 days", description: "20GB Data", benefits: ["20GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "BSNL_D197", amount: 197, validity: "30 days", description: "35GB Data", benefits: ["35GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "BSNL_D297", amount: 297, validity: "30 days", description: "50GB Data", benefits: ["50GB Data", "No Voice/SMS"], planType: "data" },
        { planId: "BSNL_D397", amount: 397, validity: "30 days", description: "75GB Data", benefits: ["75GB Data", "No Voice/SMS"], planType: "data" },
        
        // Top-up Plans (6 plans)
        { planId: "BSNL_T10", amount: 10, validity: "1 day", description: "Quick Top-up", benefits: ["₹8.5 Talk Time", "Local Calls"], planType: "topup" },
        { planId: "BSNL_T20", amount: 20, validity: "2 days", description: "Mini Top-up", benefits: ["₹17 Talk Time", "100MB Data"], planType: "topup" },
        { planId: "BSNL_T50", amount: 50, validity: "7 days", description: "Weekly Top-up", benefits: ["₹43 Talk Time", "400MB Data"], planType: "topup" },
        { planId: "BSNL_T100", amount: 100, validity: "14 days", description: "Fortnightly Top-up", benefits: ["₹87 Talk Time", "900MB Data"], planType: "topup" },
        { planId: "BSNL_T200", amount: 200, validity: "28 days", description: "Monthly Top-up", benefits: ["₹180 Talk Time", "1.8GB Data"], planType: "topup" },
        { planId: "BSNL_T500", amount: 500, validity: "56 days", description: "Mega Top-up", benefits: ["₹465 Talk Time", "4.5GB Data"], planType: "topup" }
      ]
    };

    const operatorKey = operator.toLowerCase().replace(/[^a-z_]/g, '_');
    res.json(plans[operatorKey] || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Process recharge (requires authentication for payment)
router.post('/process', auth, async (req, res) => {
  try {
    const { phoneNumber, operator, plan, paymentMethod } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (paymentMethod === 'wallet' && user.balance < plan.amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9);
    
    const transaction = new Transaction({
      userId: req.user.id,
      type: 'recharge',
      amount: plan.amount,
      number: phoneNumber,
      operator,
      status: 'success',
      transactionId,
      paymentMethod,
      description: `Recharge for ${phoneNumber} - ${operator}`
    });

    await transaction.save();

    if (paymentMethod === 'wallet') {
      user.balance -= plan.amount;
      await user.save();
    }

    res.json({
      message: 'Recharge successful',
      transaction: {
        id: transaction._id,
        transactionId,
        amount: plan.amount,
        status: 'success'
      },
      user: {
        balance: user.balance
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Process guest recharge (no authentication required)
router.post('/guest-process', async (req, res) => {
  try {
    const { phoneNumber, operator, plan, paymentMethod } = req.body;
    
    // Only allow card/UPI payments for guests
    if (paymentMethod === 'wallet') {
      return res.status(400).json({ message: 'Wallet payment requires login' });
    }

    // Simulate payment processing
    const transactionId = 'GUEST_TXN' + Date.now() + Math.random().toString(36).substr(2, 9);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    res.json({
      message: 'Recharge successful',
      transaction: {
        transactionId,
        amount: plan.amount,
        status: 'success'
      },
      guest: true
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get recharge history (requires authentication)
router.get('/history', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user.id,
      type: 'recharge'
    }).sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;