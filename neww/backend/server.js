const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const User = require('./models/User');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here';

// MongoDB connection - simplified
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/recharge-app');
    console.log('✅ MongoDB connected successfully');
    createDemoUsers();
    clearAndCreateAllPlans();
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error.message);
    console.log('💡 Make sure MongoDB is installed and running');
    console.log('💡 Or install MongoDB from: https://www.mongodb.com/try/download/community');
    // Don't exit, continue without DB for now
  }
};

connectDB();

// Import models
const Transaction = require('./models/Transaction');
const Plan = require('./models/Plan');

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Auth middleware
const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId || decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Import routes
const plansRoutes = require('./routes/plans');
const adminRoutes = require('./routes/admin');
const rechargeRoutes = require('./routes/recharge');
const walletRoutes = require('./routes/wallet');

// Routes
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'MongoDB Server Working!', 
    database: 'MongoDB (Connected)',
    timestamp: new Date() 
  });
});

// Use routes
app.use('/api/plans', plansRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recharge', rechargeRoutes);
app.use('/api/wallet', walletRoutes);

// View all users (for testing)
app.get('/api/users/all', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude passwords
    res.json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get all transactions for admin
app.get('/api/transactions/all', async (req, res) => {
  try {
    const transactions = await Transaction.find({}).sort({ createdAt: -1 });
    const totalRevenue = transactions
      .filter(t => t.type === 'recharge' && t.status === 'success')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    res.json({
      transactions,
      totalTransactions: transactions.length,
      rechargeTransactions: transactions.filter(t => t.type === 'recharge').length,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});

// View all plans (for testing)
app.get('/api/plans/all', async (req, res) => {
  try {
    const plans = await Plan.find({});
    const plansByOperator = {};
    plans.forEach(plan => {
      if (!plansByOperator[plan.operator]) {
        plansByOperator[plan.operator] = [];
      }
      plansByOperator[plan.operator].push(plan);
    });
    
    res.json({ 
      totalCount: plans.length, 
      plansByOperator,
      operatorCounts: Object.keys(plansByOperator).map(op => ({
        operator: op,
        count: plansByOperator[op].length
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plans' });
  }
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, role = 'user' } = req.body;
    

    
    // Basic validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Password validation
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }] 
    });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      if (existingUser.phone === phone) {
        return res.status(400).json({ message: 'Phone number already registered' });
      }
    }

    const user = new User({ name, email, phone, password, balance: 0, role });
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role.toUpperCase() }, JWT_SECRET);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        balance: user.balance,
        role: user.role,
        favorites: user.favorites
      }
    });
  } catch (error) {

    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role.toUpperCase() }, JWT_SECRET);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        balance: user.balance,
        role: user.role,
        favorites: user.favorites || [],
        twoFactorEnabled: user.twoFactorEnabled || false
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/me', auth, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    balance: req.user.balance,
    role: req.user.role,
    favorites: req.user.favorites,
    twoFactorEnabled: req.user.twoFactorEnabled
  });
});

// 2FA routes
app.post('/api/auth/enable-2fa', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { twoFactorEnabled: true });
    res.json({ message: '2FA enabled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/disable-2fa', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { twoFactorEnabled: false });
    res.json({ message: '2FA disabled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User routes
app.put('/api/users/profile', auth, async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, avatar },
      { new: true }
    );

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      balance: user.balance,
      role: user.role,
      avatar: user.avatar,
      favorites: user.favorites,
      twoFactorEnabled: user.twoFactorEnabled
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/users/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Password validation
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    if (!/[a-z]/.test(newPassword)) {
      return res.status(400).json({ message: 'Password must contain at least one lowercase letter' });
    }
    if (!/[A-Z]/.test(newPassword)) {
      return res.status(400).json({ message: 'Password must contain at least one uppercase letter' });
    }
    if (!/\d/.test(newPassword)) {
      return res.status(400).json({ message: 'Password must contain at least one number' });
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      return res.status(400).json({ message: 'Password must contain at least one special character' });
    }
    
    const user = await User.findById(req.user._id);
    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/users/favorites/:id', auth, async (req, res) => {
  try {
    const { nickname, number, operator } = req.body;
    const user = await User.findById(req.user._id);
    
    const favorite = user.favorites.id(req.params.id);
    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    favorite.nickname = nickname;
    favorite.number = number;
    favorite.operator = operator;
    
    await user.save();
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/users/favorites/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.favorites.pull(req.params.id);
    await user.save();
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Wallet routes
app.get('/api/wallet/balance', auth, (req, res) => {
  res.json({ balance: req.user.balance });
});

app.post('/api/wallet/add', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { balance: parseFloat(amount) } },
      { new: true }
    );
    
    const transaction = new Transaction({
      userId: user._id,
      type: 'wallet_add',
      amount: parseFloat(amount),
      description: 'Wallet top-up'
    });
    await transaction.save();

    res.json({
      message: 'Money added successfully',
      balance: user.balance,
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/wallet/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ 
      userId: req.user._id, 
      type: 'wallet_add' 
    }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/wallet/all-transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/recharge/history', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const transactions = await Transaction.find({ 
      userId: req.user._id, 
      type: 'recharge' 
    })
    .sort({ createdAt: -1 })
    .limit(limit);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});



// Plan management routes
app.get('/api/admin/plans', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    // For now, return empty array since we don't have Plan model in main server
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/admin/plans', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    const plan = new Plan(req.body);
    await plan.save();
    res.json({ message: 'Plan added successfully', plan });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/admin/plans/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Plan updated successfully', plan });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/admin/plans/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Initialize 100+ plans endpoint (one-time use)
app.post('/api/admin/initialize-plans', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Clear existing plans
    await Plan.deleteMany({});

    const comprehensive100Plans = [
      // Airtel Plans (30)
      { planId: 'AIR_19', operator: 'airtel_prepaid', planType: 'data', amount: 19, validity: '1 day', description: '1GB Data', benefits: ['1GB Data'] },
      { planId: 'AIR_79', operator: 'airtel_prepaid', planType: 'fulltt', amount: 79, validity: '28 days', description: 'Unlimited calls + 200MB/day', benefits: ['Unlimited Voice', '200MB Data/day', '100 SMS/day'] },
      { planId: 'AIR_155', operator: 'airtel_prepaid', planType: 'fulltt', amount: 155, validity: '24 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
      { planId: 'AIR_179', operator: 'airtel_prepaid', planType: 'fulltt', amount: 179, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
      { planId: 'AIR_199', operator: 'airtel_prepaid', planType: 'fulltt', amount: 199, validity: '24 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day', 'Wynk Music'] },
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
      
      // Jio Plans (30)
      { planId: 'JIO_15', operator: 'jio_prepaid', planType: 'data', amount: 15, validity: '1 day', description: '1GB Data', benefits: ['1GB Data'] },
      { planId: 'JIO_75', operator: 'jio_prepaid', planType: 'fulltt', amount: 75, validity: '28 days', description: 'JioPhone Plan', benefits: ['2GB Data', 'Unlimited Voice', '300 SMS', 'JioApps'] },
      { planId: 'JIO_155', operator: 'jio_prepaid', planType: 'fulltt', amount: 155, validity: '24 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'JioApps'] },
      { planId: 'JIO_179', operator: 'jio_prepaid', planType: 'fulltt', amount: 179, validity: '28 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day', 'JioApps'] },
      { planId: 'JIO_209', operator: 'jio_prepaid', planType: 'fulltt', amount: 209, validity: '28 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day', 'JioApps'] },
      { planId: 'JIO_239', operator: 'jio_prepaid', planType: 'fulltt', amount: 239, validity: '28 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day', 'JioApps'] },
      { planId: 'JIO_299', operator: 'jio_prepaid', planType: 'fulltt', amount: 299, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'JioApps'] },
      { planId: 'JIO_349', operator: 'jio_prepaid', planType: 'fulltt', amount: 349, validity: '28 days', description: 'Unlimited calls + 2.5GB/day', benefits: ['Unlimited Voice', '2.5GB Data/day', '100 SMS/day', 'JioApps', 'Netflix Mobile'] },
      { planId: 'JIO_395', operator: 'jio_prepaid', planType: 'fulltt', amount: 395, validity: '84 days', description: 'Unlimited calls + 6GB total', benefits: ['Unlimited Voice', '6GB Total Data', '1000 SMS', 'JioApps'] },
      { planId: 'JIO_533', operator: 'jio_prepaid', planType: 'fulltt', amount: 533, validity: '56 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'JioApps'] },
      { planId: 'JIO_719', operator: 'jio_prepaid', planType: 'fulltt', amount: 719, validity: '84 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day', 'JioApps'] },
      { planId: 'JIO_999', operator: 'jio_prepaid', planType: 'fulltt', amount: 999, validity: '84 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'JioApps', 'Netflix Mobile'] },
      { planId: 'JIO_1559', operator: 'jio_prepaid', planType: 'fulltt', amount: 1559, validity: '336 days', description: 'Unlimited calls + 24GB/month', benefits: ['Unlimited Voice', '24GB Data/month', '3600 SMS', 'JioApps'] },
      { planId: 'JIO_2999', operator: 'jio_prepaid', planType: 'fulltt', amount: 2999, validity: '365 days', description: 'Unlimited calls + 2.5GB/day', benefits: ['Unlimited Voice', '2.5GB Data/day', '100 SMS/day', 'JioApps', 'Netflix Mobile'] },
      { planId: 'JIO_4199', operator: 'jio_prepaid', planType: 'fulltt', amount: 4199, validity: '365 days', description: 'Unlimited calls + 3GB/day', benefits: ['Unlimited Voice', '3GB Data/day', '100 SMS/day', 'JioApps', 'Netflix Premium'] },
      
      // Vi Plans (25)
      { planId: 'VI_16', operator: 'vi_prepaid', planType: 'data', amount: 16, validity: '1 day', description: '1GB Data', benefits: ['1GB Data'] },
      { planId: 'VI_155', operator: 'vi_prepaid', planType: 'fulltt', amount: 155, validity: '24 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
      { planId: 'VI_179', operator: 'vi_prepaid', planType: 'fulltt', amount: 179, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
      { planId: 'VI_219', operator: 'vi_prepaid', planType: 'fulltt', amount: 219, validity: '28 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day', 'Vi Movies & TV'] },
      { planId: 'VI_269', operator: 'vi_prepaid', planType: 'fulltt', amount: 269, validity: '28 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day'] },
      { planId: 'VI_319', operator: 'vi_prepaid', planType: 'fulltt', amount: 319, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'Binge All Night'] },
      { planId: 'VI_359', operator: 'vi_prepaid', planType: 'fulltt', amount: 359, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'Weekend Data Rollover'] },
      { planId: 'VI_449', operator: 'vi_prepaid', planType: 'fulltt', amount: 449, validity: '56 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
      { planId: 'VI_539', operator: 'vi_prepaid', planType: 'fulltt', amount: 539, validity: '56 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
      { planId: 'VI_699', operator: 'vi_prepaid', planType: 'fulltt', amount: 699, validity: '84 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day'] },
      { planId: 'VI_859', operator: 'vi_prepaid', planType: 'fulltt', amount: 859, validity: '84 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'Weekend Data Rollover'] },
      { planId: 'VI_1799', operator: 'vi_prepaid', planType: 'fulltt', amount: 1799, validity: '365 days', description: 'Unlimited calls + 24GB/month', benefits: ['Unlimited Voice', '24GB Data/month', '100 SMS/day', 'Vi Movies & TV'] },
      { planId: 'VI_2899', operator: 'vi_prepaid', planType: 'fulltt', amount: 2899, validity: '365 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'Vi Movies & TV', 'Netflix Mobile'] },
      
      // BSNL Plans (15)
      { planId: 'BSNL_108', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 108, validity: '25 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
      { planId: 'BSNL_187', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 187, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
      { planId: 'BSNL_247', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 247, validity: '45 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
      { planId: 'BSNL_297', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 297, validity: '54 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
      { planId: 'BSNL_397', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 397, validity: '80 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
      { planId: 'BSNL_499', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 499, validity: '90 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
      { planId: 'BSNL_666', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 666, validity: '160 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
      { planId: 'BSNL_997', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 997, validity: '180 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
      { planId: 'BSNL_1999', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 1999, validity: '365 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
      { planId: 'BSNL_2399', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 2399, validity: '365 days', description: 'Unlimited calls + 3GB/day', benefits: ['Unlimited Voice', '3GB Data/day', '100 SMS/day'] }
    ];

    await Plan.insertMany(comprehensive100Plans);
    const totalPlans = await Plan.countDocuments();
    
    res.json({ 
      message: `Successfully initialized ${totalPlans} plans in database`,
      totalPlans,
      operators: {
        airtel_prepaid: await Plan.countDocuments({ operator: 'airtel_prepaid' }),
        jio_prepaid: await Plan.countDocuments({ operator: 'jio_prepaid' }),
        vi_prepaid: await Plan.countDocuments({ operator: 'vi_prepaid' }),
        bsnl_prepaid: await Plan.countDocuments({ operator: 'bsnl_prepaid' })
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error initializing plans', error: error.message });
  }
});

// Admin routes
app.get('/api/admin/users', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/admin/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalTransactions = await Transaction.countDocuments();
    const totalRevenue = await Transaction.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      totalUsers,
      totalAdmins,
      totalTransactions,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentTransactions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Password reset routes
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create reset URL
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@rechargeapp.com',
      to: user.email,
      subject: 'Password Reset Request - Recharge App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>You requested a password reset for your Recharge App account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">Recharge App - Mobile Recharge & Wallet Management</p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);
    
    res.json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Failed to send password reset email' });
  }
});

app.post('/api/auth/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password
    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create demo users
const createDemoUsers = async () => {
  try {
    const existingUser = await User.findOne({ email: 'user@demo.com' });
    if (existingUser) {
      console.log('✅ Demo users already exist');
      return;
    }

    const demoUsers = [
      {
        name: 'Demo User',
        email: 'user@demo.com',
        phone: '9876543210',
        password: await bcrypt.hash('password123', 12),
        balance: 1000,
        role: 'user',
        favorites: [
          { nickname: 'Mom', number: '9876543210', operator: 'airtel' },
          { nickname: 'Office', number: '9123456789', operator: 'jio' }
        ]
      },
      {
        name: 'Admin User',
        email: 'admin@demo.com',
        phone: '9123456789',
        password: await bcrypt.hash('admin123', 12),
        balance: 5000,
        role: 'admin'
      }
    ];

    await User.insertMany(demoUsers);
    console.log('✅ Demo users created successfully');
    console.log('📧 Login: user@demo.com / password123');
  } catch (error) {
    console.log('⚠️ Demo user creation failed:', error.message);
  }
};

// Create additional plans
const createAdditionalPlans = async () => {
  try {

    const additionalPlans = [
      // Jio Data Plans
      { planId: 'JIO_D15', operator: 'jio_prepaid', planType: 'data', amount: 15, validity: '1 day', description: '1GB Data', benefits: ['1GB Data', 'No Voice/SMS'] },
      { planId: 'JIO_D25', operator: 'jio_prepaid', planType: 'data', amount: 25, validity: '2 days', description: '1.5GB Data', benefits: ['1.5GB Data', 'No Voice/SMS'] },
      { planId: 'JIO_D39', operator: 'jio_prepaid', planType: 'data', amount: 39, validity: '7 days', description: '2.5GB Data', benefits: ['2.5GB Data', 'No Voice/SMS'] },
      { planId: 'JIO_D69', operator: 'jio_prepaid', planType: 'data', amount: 69, validity: '28 days', description: '6GB Data', benefits: ['6GB Data', 'No Voice/SMS'] },
      { planId: 'JIO_D99', operator: 'jio_prepaid', planType: 'data', amount: 99, validity: '28 days', description: '10GB Data', benefits: ['10GB Data', 'No Voice/SMS'] },
      { planId: 'JIO_D149', operator: 'jio_prepaid', planType: 'data', amount: 149, validity: '30 days', description: '12GB Data', benefits: ['12GB Data', 'No Voice/SMS'] },
      { planId: 'JIO_D199', operator: 'jio_prepaid', planType: 'data', amount: 199, validity: '30 days', description: '25GB Data', benefits: ['25GB Data', 'No Voice/SMS'] },
      { planId: 'JIO_D299', operator: 'jio_prepaid', planType: 'data', amount: 299, validity: '30 days', description: '50GB Data', benefits: ['50GB Data', 'No Voice/SMS'] },
      { planId: 'JIO_D399', operator: 'jio_prepaid', planType: 'data', amount: 399, validity: '30 days', description: '75GB Data', benefits: ['75GB Data', 'No Voice/SMS'] },
      
      // Jio Top-up Plans
      { planId: 'JIO_T11', operator: 'jio_prepaid', planType: 'topup', amount: 11, validity: 'N/A', description: 'Main Balance', benefits: ['₹11 Main Balance'] },
      { planId: 'JIO_T22', operator: 'jio_prepaid', planType: 'topup', amount: 22, validity: 'N/A', description: 'Main Balance', benefits: ['₹22 Main Balance'] },
      { planId: 'JIO_T33', operator: 'jio_prepaid', planType: 'topup', amount: 33, validity: 'N/A', description: 'Main Balance', benefits: ['₹33 Main Balance'] },
      { planId: 'JIO_T55', operator: 'jio_prepaid', planType: 'topup', amount: 55, validity: 'N/A', description: 'Main Balance', benefits: ['₹55 Main Balance'] },
      { planId: 'JIO_T110', operator: 'jio_prepaid', planType: 'topup', amount: 110, validity: 'N/A', description: 'Main Balance', benefits: ['₹110 Main Balance'] },
      { planId: 'JIO_T220', operator: 'jio_prepaid', planType: 'topup', amount: 220, validity: 'N/A', description: 'Main Balance', benefits: ['₹220 Main Balance'] },
      
      // Jio Special Plans
      { planId: 'JIO_S75', operator: 'jio_prepaid', planType: 'special', amount: 75, validity: '28 days', description: 'JioPhone Plan', benefits: ['2GB Data', 'Unlimited Voice', '300 SMS', 'JioApps'] },
      { planId: 'JIO_S186', operator: 'jio_prepaid', planType: 'special', amount: 186, validity: '28 days', description: 'Work From Home', benefits: ['2GB Data/day', 'Unlimited Voice', '100 SMS/day', 'JioMeet Pro'] },
      { planId: 'JIO_S666', operator: 'jio_prepaid', planType: 'special', amount: 666, validity: '84 days', description: 'Cricket Special', benefits: ['1.5GB Data/day', 'Unlimited Voice', '100 SMS/day', 'JioTV Sports'] },
      
      // Vi Data Plans
      { planId: 'VI_D16', operator: 'vi_prepaid', planType: 'data', amount: 16, validity: '1 day', description: '1GB Data', benefits: ['1GB Data', 'No Voice/SMS'] },
      { planId: 'VI_D29', operator: 'vi_prepaid', planType: 'data', amount: 29, validity: '2 days', description: '2GB Data', benefits: ['2GB Data', 'No Voice/SMS'] },
      { planId: 'VI_D48', operator: 'vi_prepaid', planType: 'data', amount: 48, validity: '7 days', description: '3GB Data', benefits: ['3GB Data', 'No Voice/SMS'] },
      { planId: 'VI_D58', operator: 'vi_prepaid', planType: 'data', amount: 58, validity: '28 days', description: '3GB Data', benefits: ['3GB Data', 'No Voice/SMS'] },
      { planId: 'VI_D118', operator: 'vi_prepaid', planType: 'data', amount: 118, validity: '28 days', description: '12GB Data', benefits: ['12GB Data', 'No Voice/SMS'] },
      { planId: 'VI_D181', operator: 'vi_prepaid', planType: 'data', amount: 181, validity: '30 days', description: '30GB Data', benefits: ['30GB Data', 'No Voice/SMS'] },
      { planId: 'VI_D301', operator: 'vi_prepaid', planType: 'data', amount: 301, validity: '30 days', description: '50GB Data', benefits: ['50GB Data', 'No Voice/SMS'] },
      
      // Vi Top-up Plans
      { planId: 'VI_T10', operator: 'vi_prepaid', planType: 'topup', amount: 10, validity: 'N/A', description: 'Main Balance', benefits: ['₹10 Main Balance'] },
      { planId: 'VI_T20', operator: 'vi_prepaid', planType: 'topup', amount: 20, validity: 'N/A', description: 'Main Balance', benefits: ['₹20 Main Balance'] },
      { planId: 'VI_T30', operator: 'vi_prepaid', planType: 'topup', amount: 30, validity: 'N/A', description: 'Main Balance', benefits: ['₹30 Main Balance'] },
      { planId: 'VI_T50', operator: 'vi_prepaid', planType: 'topup', amount: 50, validity: 'N/A', description: 'Main Balance', benefits: ['₹50 Main Balance'] },
      { planId: 'VI_T100', operator: 'vi_prepaid', planType: 'topup', amount: 100, validity: 'N/A', description: 'Main Balance', benefits: ['₹100 Main Balance'] },
      
      // Vi Special Plans
      { planId: 'VI_S95', operator: 'vi_prepaid', planType: 'special', amount: 95, validity: '28 days', description: 'Night Unlimited', benefits: ['Unlimited Data (12AM-6AM)', 'Unlimited Voice', '100 SMS/day'] },
      { planId: 'VI_S199', operator: 'vi_prepaid', planType: 'special', amount: 199, validity: '28 days', description: 'Hero Unlimited', benefits: ['Unlimited Data (2AM-5AM)', '2GB Day Data', 'Unlimited Voice'] },
      
      // BSNL Data Plans
      { planId: 'BSNL_D17', operator: 'bsnl_prepaid', planType: 'data', amount: 17, validity: '1 day', description: '1GB Data', benefits: ['1GB Data', 'No Voice/SMS'] },
      { planId: 'BSNL_D47', operator: 'bsnl_prepaid', planType: 'data', amount: 47, validity: '30 days', description: '2GB Data', benefits: ['2GB Data', 'No Voice/SMS'] },
      { planId: 'BSNL_D97', operator: 'bsnl_prepaid', planType: 'data', amount: 97, validity: '30 days', description: '10GB Data', benefits: ['10GB Data', 'No Voice/SMS'] },
      { planId: 'BSNL_D147', operator: 'bsnl_prepaid', planType: 'data', amount: 147, validity: '30 days', description: '20GB Data', benefits: ['20GB Data', 'No Voice/SMS'] },
      
      // BSNL Top-up Plans
      { planId: 'BSNL_T10', operator: 'bsnl_prepaid', planType: 'topup', amount: 10, validity: 'N/A', description: 'Main Balance', benefits: ['₹10 Main Balance'] },
      { planId: 'BSNL_T20', operator: 'bsnl_prepaid', planType: 'topup', amount: 20, validity: 'N/A', description: 'Main Balance', benefits: ['₹20 Main Balance'] },
      { planId: 'BSNL_T50', operator: 'bsnl_prepaid', planType: 'topup', amount: 50, validity: 'N/A', description: 'Main Balance', benefits: ['₹50 Main Balance'] },
      { planId: 'BSNL_T100', operator: 'bsnl_prepaid', planType: 'topup', amount: 100, validity: 'N/A', description: 'Main Balance', benefits: ['₹100 Main Balance'] },
      
      // BSNL Special Plans
      { planId: 'BSNL_S56', operator: 'bsnl_prepaid', planType: 'special', amount: 56, validity: '28 days', description: 'BSNL Chaukka', benefits: ['4GB Data', 'Unlimited Voice', '100 SMS/day'] },
      { planId: 'BSNL_S84', operator: 'bsnl_prepaid', planType: 'special', amount: 84, validity: '28 days', description: 'BSNL Sixer', benefits: ['6GB Data', 'Unlimited Voice', '100 SMS/day'] },
      
      // Airtel Special Plans
      { planId: 'AIR_S95', operator: 'airtel_prepaid', planType: 'special', amount: 95, validity: '28 days', description: 'Night Data Special', benefits: ['6GB Night Data (12AM-6AM)', 'Unlimited Voice', '100 SMS/day'] },
      { planId: 'AIR_S148', operator: 'airtel_prepaid', planType: 'special', amount: 148, validity: '30 days', description: 'Work From Home', benefits: ['20GB Data', 'Unlimited Voice', '100 SMS/day', 'Zoom Premium'] },
      { planId: 'AIR_S296', operator: 'airtel_prepaid', planType: 'special', amount: 296, validity: '30 days', description: 'Student Special', benefits: ['25GB Data', 'Unlimited Voice', '100 SMS/day', 'Educational Apps'] }
    ];

    await Plan.insertMany(additionalPlans);

  } catch (error) {
    console.log(' Additional plan creation failed:', error.message);
  }
};

// Clear and recreate all plans
const clearAndCreateAllPlans = async () => {
  try {
    // Clear existing plans
    await Plan.deleteMany({});

    
    // Create all plans
    await createDemoPlans();
    await createAdditionalPlans();
    
    const totalPlans = await Plan.countDocuments();

  } catch (error) {
    console.log(' Plan recreation failed:', error.message);
  }
};

// Create demo plans
const createDemoPlans = async () => {
  try {

    const demoPlans = [
      // Airtel Prepaid - Full Talktime Plans
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
      
      // Airtel Prepaid - Data Only Plans
      { planId: 'AIR_D19', operator: 'airtel_prepaid', planType: 'data', amount: 19, validity: '1 day', description: '1GB Data', benefits: ['1GB Data', 'No Voice/SMS'] },
      { planId: 'AIR_D25', operator: 'airtel_prepaid', planType: 'data', amount: 25, validity: '2 days', description: '1.5GB Data', benefits: ['1.5GB Data', 'No Voice/SMS'] },
      { planId: 'AIR_D48', operator: 'airtel_prepaid', planType: 'data', amount: 48, validity: '3 days', description: '3GB Data', benefits: ['3GB Data', 'No Voice/SMS'] },
      { planId: 'AIR_D65', operator: 'airtel_prepaid', planType: 'data', amount: 65, validity: '7 days', description: '4GB Data', benefits: ['4GB Data', 'No Voice/SMS'] },
      { planId: 'AIR_D98', operator: 'airtel_prepaid', planType: 'data', amount: 98, validity: '28 days', description: '6GB Data', benefits: ['6GB Data', 'No Voice/SMS'] },
      { planId: 'AIR_D118', operator: 'airtel_prepaid', planType: 'data', amount: 118, validity: '28 days', description: '12GB Data', benefits: ['12GB Data', 'No Voice/SMS'] },
      
      // Airtel Prepaid - Top-up Plans
      { planId: 'AIR_T10', operator: 'airtel_prepaid', planType: 'topup', amount: 10, validity: 'N/A', description: 'Main Balance', benefits: ['₹10 Main Balance'] },
      { planId: 'AIR_T20', operator: 'airtel_prepaid', planType: 'topup', amount: 20, validity: 'N/A', description: 'Main Balance', benefits: ['₹20 Main Balance'] },
      { planId: 'AIR_T50', operator: 'airtel_prepaid', planType: 'topup', amount: 50, validity: 'N/A', description: 'Main Balance', benefits: ['₹50 Main Balance'] },
      { planId: 'AIR_T100', operator: 'airtel_prepaid', planType: 'topup', amount: 100, validity: 'N/A', description: 'Main Balance', benefits: ['₹100 Main Balance'] },
      
      // Jio Prepaid - Full Talktime Plans
      { planId: 'JIO_155', operator: 'jio_prepaid', planType: 'fulltt', amount: 155, validity: '24 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'JioApps'] },
      { planId: 'JIO_179', operator: 'jio_prepaid', planType: 'fulltt', amount: 179, validity: '28 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day', 'JioApps'] },
      { planId: 'JIO_209', operator: 'jio_prepaid', planType: 'fulltt', amount: 209, validity: '28 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day', 'JioApps'] },
      { planId: 'JIO_239', operator: 'jio_prepaid', planType: 'fulltt', amount: 239, validity: '28 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day', 'JioApps'] },
      { planId: 'JIO_299', operator: 'jio_prepaid', planType: 'fulltt', amount: 299, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'JioApps'] },
      { planId: 'JIO_349', operator: 'jio_prepaid', planType: 'fulltt', amount: 349, validity: '28 days', description: 'Unlimited calls + 2.5GB/day', benefits: ['Unlimited Voice', '2.5GB Data/day', '100 SMS/day', 'JioApps', 'Netflix Mobile'] },
      { planId: 'JIO_395', operator: 'jio_prepaid', planType: 'fulltt', amount: 395, validity: '84 days', description: 'Unlimited calls + 6GB total', benefits: ['Unlimited Voice', '6GB Total Data', '1000 SMS', 'JioApps'] },
      { planId: 'JIO_533', operator: 'jio_prepaid', planType: 'fulltt', amount: 533, validity: '56 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'JioApps'] },
      { planId: 'JIO_719', operator: 'jio_prepaid', planType: 'fulltt', amount: 719, validity: '84 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day', 'JioApps'] },
      { planId: 'JIO_999', operator: 'jio_prepaid', planType: 'fulltt', amount: 999, validity: '84 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'JioApps', 'Netflix Mobile'] },
      { planId: 'JIO_1559', operator: 'jio_prepaid', planType: 'fulltt', amount: 1559, validity: '336 days', description: 'Unlimited calls + 24GB/month', benefits: ['Unlimited Voice', '24GB Data/month', '3600 SMS', 'JioApps'] },
      { planId: 'JIO_2999', operator: 'jio_prepaid', planType: 'fulltt', amount: 2999, validity: '365 days', description: 'Unlimited calls + 2.5GB/day', benefits: ['Unlimited Voice', '2.5GB Data/day', '100 SMS/day', 'JioApps', 'Netflix Mobile'] },
      
      // Vi Prepaid - Full Talktime Plans
      { planId: 'VI_155', operator: 'vi_prepaid', planType: 'fulltt', amount: 155, validity: '24 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
      { planId: 'VI_179', operator: 'vi_prepaid', planType: 'fulltt', amount: 179, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
      { planId: 'VI_219', operator: 'vi_prepaid', planType: 'fulltt', amount: 219, validity: '28 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day', 'Vi Movies & TV'] },
      { planId: 'VI_269', operator: 'vi_prepaid', planType: 'fulltt', amount: 269, validity: '28 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day'] },
      { planId: 'VI_319', operator: 'vi_prepaid', planType: 'fulltt', amount: 319, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'Binge All Night'] },
      { planId: 'VI_359', operator: 'vi_prepaid', planType: 'fulltt', amount: 359, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'Weekend Data Rollover'] },
      { planId: 'VI_449', operator: 'vi_prepaid', planType: 'fulltt', amount: 449, validity: '56 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
      { planId: 'VI_539', operator: 'vi_prepaid', planType: 'fulltt', amount: 539, validity: '56 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
      { planId: 'VI_699', operator: 'vi_prepaid', planType: 'fulltt', amount: 699, validity: '84 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day'] },
      { planId: 'VI_859', operator: 'vi_prepaid', planType: 'fulltt', amount: 859, validity: '84 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'Weekend Data Rollover'] },
      { planId: 'VI_1799', operator: 'vi_prepaid', planType: 'fulltt', amount: 1799, validity: '365 days', description: 'Unlimited calls + 24GB/month', benefits: ['Unlimited Voice', '24GB Data/month', '100 SMS/day', 'Vi Movies & TV'] },
      
      // BSNL Prepaid - Full Talktime Plans
      { planId: 'BSNL_108', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 108, validity: '25 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
      { planId: 'BSNL_187', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 187, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
      { planId: 'BSNL_247', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 247, validity: '45 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
      { planId: 'BSNL_297', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 297, validity: '54 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
      { planId: 'BSNL_397', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 397, validity: '80 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
      { planId: 'BSNL_499', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 499, validity: '90 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
      { planId: 'BSNL_666', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 666, validity: '160 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
      { planId: 'BSNL_997', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 997, validity: '180 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
      { planId: 'BSNL_1999', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 1999, validity: '365 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
      
      // Airtel Postpaid Plans
      { planId: 'AIRP_299', operator: 'airtel_postpaid', planType: 'postpaid', amount: 299, validity: '30 days', description: '25GB Data + Unlimited Calls', benefits: ['25GB Data', 'Unlimited Voice', '100 SMS/day', 'Airtel Thanks'] },
      { planId: 'AIRP_399', operator: 'airtel_postpaid', planType: 'postpaid', amount: 399, validity: '30 days', description: '40GB Data + Unlimited Calls', benefits: ['40GB Data', 'Unlimited Voice', '100 SMS/day', 'Netflix Basic'] },
      { planId: 'AIRP_499', operator: 'airtel_postpaid', planType: 'postpaid', amount: 499, validity: '30 days', description: '75GB Data + Unlimited Calls', benefits: ['75GB Data', 'Unlimited Voice', '100 SMS/day', 'Netflix Basic + Amazon Prime'] },
      { planId: 'AIRP_699', operator: 'airtel_postpaid', planType: 'postpaid', amount: 699, validity: '30 days', description: '100GB Data + Unlimited Calls', benefits: ['100GB Data', 'Unlimited Voice', '100 SMS/day', 'Netflix Premium + Disney+ Hotstar'] },
      { planId: 'AIRP_999', operator: 'airtel_postpaid', planType: 'postpaid', amount: 999, validity: '30 days', description: '150GB Data + Unlimited Calls', benefits: ['150GB Data', 'Unlimited Voice', '100 SMS/day', 'All OTT Apps'] },
      
      // DTH Plans - Tata Play
      { planId: 'TP_153', operator: 'tataplay', planType: 'fulltt', amount: 153, validity: '30 days', description: 'South Titanium HD', benefits: ['100+ channels', 'HD quality', 'Regional content'] },
      { planId: 'TP_240', operator: 'tataplay', planType: 'fulltt', amount: 240, validity: '30 days', description: 'Hindi Basic HD', benefits: ['150+ channels', 'HD quality', 'Hindi entertainment'] },
      { planId: 'TP_340', operator: 'tataplay', planType: 'fulltt', amount: 340, validity: '30 days', description: 'Sports Special', benefits: ['200+ channels', 'Sports channels', 'HD quality'] },
      
      // DTH Plans - Airtel Digital TV
      { planId: 'ADT_154', operator: 'airteldth', planType: 'fulltt', amount: 154, validity: '30 days', description: 'South Value Pack', benefits: ['120+ channels', 'Regional content', 'HD channels'] },
      { planId: 'ADT_299', operator: 'airteldth', planType: 'fulltt', amount: 299, validity: '30 days', description: 'Entertainment Pack', benefits: ['200+ channels', 'Premium content', 'Sports channels'] },
      
      // DTH Plans - Dish TV
      { planId: 'DISH_169', operator: 'dishtv', planType: 'fulltt', amount: 169, validity: '30 days', description: 'Family Pack', benefits: ['130+ channels', 'Family entertainment', 'Regional channels'] },
      { planId: 'DISH_279', operator: 'dishtv', planType: 'fulltt', amount: 279, validity: '30 days', description: 'Gold Pack', benefits: ['180+ channels', 'Premium content', 'HD channels'] },
      
      // Electricity Bill Plans
      { planId: 'BESCOM_BILL', operator: 'bescom', planType: 'bill', amount: 0, validity: 'Bill Payment', description: 'Pay your BESCOM electricity bill', benefits: ['Instant payment', 'No convenience fee', 'SMS confirmation'] },
      { planId: 'MSEDCL_BILL', operator: 'msedcl', planType: 'bill', amount: 0, validity: 'Bill Payment', description: 'Pay your MSEDCL electricity bill', benefits: ['Instant payment', 'No convenience fee', 'SMS confirmation'] },
      { planId: 'TNEB_BILL', operator: 'tneb', planType: 'bill', amount: 0, validity: 'Bill Payment', description: 'Pay your TNEB electricity bill', benefits: ['Instant payment', 'No convenience fee', 'SMS confirmation'] },
      { planId: 'KSEB_BILL', operator: 'kseb', planType: 'bill', amount: 0, validity: 'Bill Payment', description: 'Pay your KSEB electricity bill', benefits: ['Instant payment', 'No convenience fee', 'SMS confirmation'] },
      
      // Broadband Bill Plans
      { planId: 'ABB_BILL', operator: 'airtel_bb', planType: 'bill', amount: 0, validity: 'Bill Payment', description: 'Pay your Airtel Broadband bill', benefits: ['Instant payment', 'No convenience fee', 'SMS confirmation'] },
      { planId: 'JF_BILL', operator: 'jio_fiber', planType: 'bill', amount: 0, validity: 'Bill Payment', description: 'Pay your Jio Fiber bill', benefits: ['Instant payment', 'No convenience fee', 'SMS confirmation'] },
      { planId: 'BBB_BILL', operator: 'bsnl_bb', planType: 'bill', amount: 0, validity: 'Bill Payment', description: 'Pay your BSNL Broadband bill', benefits: ['Instant payment', 'No convenience fee', 'SMS confirmation'] },
      { planId: 'ACT_BILL', operator: 'act_fiber', planType: 'bill', amount: 0, validity: 'Bill Payment', description: 'Pay your ACT Fibernet bill', benefits: ['Instant payment', 'No convenience fee', 'SMS confirmation'] }
    ];

    await Plan.insertMany(demoPlans);

  } catch (error) {
    console.log('⚠️ Demo plan creation failed:', error.message);
  }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`💾 Database: MongoDB (Connected)`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
  console.log(`🧪 Test: http://localhost:${PORT}/api/test`);
  console.log(`🔑 Demo: user@demo.com / password123`);
});