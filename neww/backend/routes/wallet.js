const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get wallet balance
router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('balance');
    res.json({ balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add money to wallet
router.post('/add', auth, async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    
    if (amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const user = await User.findById(req.user.id);
    const transactionId = 'WAL' + Date.now() + Math.random().toString(36).substr(2, 9);
    
    const transaction = new Transaction({
      userId: req.user.id,
      type: 'wallet_add',
      amount,
      status: 'success',
      transactionId,
      paymentMethod,
      description: `Wallet top-up via ${paymentMethod}`
    });

    await transaction.save();

    user.balance += amount;
    await user.save();

    res.json({
      message: 'Money added successfully',
      balance: user.balance,
      transaction: {
        id: transaction._id,
        transactionId,
        amount,
        status: 'success'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get wallet transactions
router.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user.id,
      type: { $in: ['wallet_add', 'wallet_deduct'] }
    }).sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all transactions
router.get('/all-transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin: Get all users
router.get('/admin/users', auth, async (req, res) => {
  try {
    const users = await User.find({}, '-password -twoFactorSecret').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all transactions
router.get('/admin/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({})
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;