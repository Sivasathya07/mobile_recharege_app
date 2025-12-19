const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'your-super-secret-jwt-key-here';

// Simple MongoDB connection with better error handling
const connectDB = async () => {
  try {
    // Try local MongoDB first
    await mongoose.connect('mongodb://localhost:27017/recharge-app');
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.log('❌ Local MongoDB failed:', error.message);
    
    // Try MongoDB Atlas connection
    try {
      await mongoose.connect('mongodb+srv://demo:demo123@cluster0.mongodb.net/recharge-app?retryWrites=true&w=majority');
      console.log('✅ MongoDB Atlas connected successfully');
      return true;
    } catch (atlasError) {
      console.log('❌ MongoDB Atlas failed:', atlasError.message);
      console.log('📝 Using in-memory fallback...');
      return false;
    }
  }
};

// MongoDB Models
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  balance: { type: Number, default: 0 },
  role: { type: String, default: 'user' },
  favorites: [{
    nickname: String,
    number: String,
    operator: String
  }],
  twoFactorEnabled: { type: Boolean, default: false }
}, { timestamps: true });

const transactionSchema = new mongoose.Schema({
  userId: String,
  type: String,
  amount: Number,
  phoneNumber: String,
  operator: String,
  status: { type: String, default: 'success' },
  description: String
}, { timestamps: true });

let User, Transaction;
let useDatabase = false;

// In-memory fallback data
let users = [
  {
    id: '1',
    name: 'Demo User',
    email: 'user@demo.com',
    phone: '9876543210',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uDfm',
    balance: 1000,
    role: 'user',
    favorites: [
      { _id: '1', nickname: 'Mom', number: '9876543210', operator: 'airtel' },
      { _id: '2', nickname: 'Office', number: '9123456789', operator: 'jio' }
    ],
    twoFactorEnabled: false
  }
];

let transactions = [];

// Auth middleware
const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (useDatabase) {
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Token is not valid' });
      }
      req.user = user;
    } else {
      const user = users.find(u => u.id === decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Token is not valid' });
      }
      req.user = user;
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Routes
app.get('/api/test', (req, res) => {
  res.json({ 
    message: useDatabase ? 'MongoDB Server Working!' : 'In-Memory Server Working!',
    database: useDatabase ? 'MongoDB' : 'In-Memory',
    timestamp: new Date() 
  });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    if (useDatabase) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ name, email, phone, password: hashedPassword });
      await user.save();

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
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
    } else {
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = {
        id: Date.now().toString(),
        name, email, phone,
        password: hashedPassword,
        balance: 0,
        role: 'user',
        favorites: [],
        twoFactorEnabled: false
      };

      users.push(newUser);
      const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
      
      res.status(201).json({
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          balance: newUser.balance,
          role: newUser.role,
          favorites: newUser.favorites
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (useDatabase) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          balance: user.balance,
          role: user.role,
          favorites: user.favorites,
          twoFactorEnabled: user.twoFactorEnabled
        }
      });
    } else {
      const user = users.find(u => u.email === email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          balance: user.balance,
          role: user.role,
          favorites: user.favorites,
          twoFactorEnabled: user.twoFactorEnabled
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/me', auth, (req, res) => {
  res.json({
    id: req.user._id || req.user.id,
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
    if (useDatabase) {
      await User.findByIdAndUpdate(req.user._id, { twoFactorEnabled: true });
    } else {
      const user = users.find(u => u.id === req.user.id);
      user.twoFactorEnabled = true;
    }
    res.json({ message: '2FA enabled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/disable-2fa', auth, async (req, res) => {
  try {
    if (useDatabase) {
      await User.findByIdAndUpdate(req.user._id, { twoFactorEnabled: false });
    } else {
      const user = users.find(u => u.id === req.user.id);
      user.twoFactorEnabled = false;
    }
    res.json({ message: '2FA disabled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User routes
app.put('/api/users/profile', auth, async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    
    if (useDatabase) {
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
    } else {
      const user = users.find(u => u.id === req.user.id);
      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (avatar) user.avatar = avatar;
      
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        balance: user.balance,
        role: user.role,
        avatar: user.avatar,
        favorites: user.favorites,
        twoFactorEnabled: user.twoFactorEnabled
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/users/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (useDatabase) {
      const user = await User.findById(req.user._id);
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      user.password = await bcrypt.hash(newPassword, 12);
      await user.save();
    } else {
      const user = users.find(u => u.id === req.user.id);
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      user.password = await bcrypt.hash(newPassword, 12);
    }
    
    res.json({ message: 'Password updated successfully' });
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
    
    if (useDatabase) {
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
    } else {
      const user = users.find(u => u.id === req.user.id);
      user.balance += parseFloat(amount);
      
      const transaction = {
        id: Date.now().toString(),
        userId: user.id,
        type: 'wallet_add',
        amount: parseFloat(amount),
        status: 'success',
        createdAt: new Date(),
        description: 'Wallet top-up'
      };
      transactions.push(transaction);
      
      res.json({
        message: 'Money added successfully',
        balance: user.balance,
        transaction
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/wallet/all-transactions', auth, async (req, res) => {
  try {
    if (useDatabase) {
      const userTransactions = await Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 });
      res.json(userTransactions);
    } else {
      const userTransactions = transactions.filter(t => t.userId === req.user.id);
      res.json(userTransactions);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Recharge routes
app.get('/api/recharge/plans/:operator', (req, res) => {
  const plans = [
    { id: 1, amount: 199, validity: '28 days', data: '2GB/day', talktime: 'Unlimited' },
    { id: 2, amount: 299, validity: '28 days', data: '2.5GB/day', talktime: 'Unlimited' },
    { id: 3, amount: 449, validity: '56 days', data: '2GB/day', talktime: 'Unlimited' },
    { id: 4, amount: 599, validity: '84 days', data: '2GB/day', talktime: 'Unlimited' }
  ];
  res.json(plans);
});

app.post('/api/recharge/process', auth, async (req, res) => {
  try {
    const { phoneNumber, operator, plan, paymentMethod } = req.body;
    
    if (paymentMethod === 'wallet') {
      if (useDatabase) {
        const user = await User.findById(req.user._id);
        if (user.balance < plan.amount) {
          return res.status(400).json({ message: 'Insufficient wallet balance' });
        }
        await User.findByIdAndUpdate(req.user._id, { $inc: { balance: -plan.amount } });
        
        const transaction = new Transaction({
          userId: req.user._id,
          type: 'recharge',
          amount: plan.amount,
          phoneNumber,
          operator,
          description: `Recharge for ${phoneNumber}`
        });
        await transaction.save();
        
        res.json({ message: 'Recharge successful', transaction });
      } else {
        const user = users.find(u => u.id === req.user.id);
        if (user.balance < plan.amount) {
          return res.status(400).json({ message: 'Insufficient wallet balance' });
        }
        user.balance -= plan.amount;
        
        const transaction = {
          id: Date.now().toString(),
          userId: user.id,
          type: 'recharge',
          amount: plan.amount,
          phoneNumber,
          operator,
          status: 'success',
          createdAt: new Date(),
          description: `Recharge for ${phoneNumber}`
        };
        transactions.push(transaction);
        
        res.json({ message: 'Recharge successful', transaction });
      }
    } else {
      res.json({ message: 'Recharge successful' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Initialize and start server
const startServer = async () => {
  const dbConnected = await connectDB();
  
  if (dbConnected) {
    User = mongoose.model('User', userSchema);
    Transaction = mongoose.model('Transaction', transactionSchema);
    useDatabase = true;
    
    // Create demo users in MongoDB
    try {
      const existingUser = await User.findOne({ email: 'user@demo.com' });
      if (!existingUser) {
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
        console.log('✅ Demo users created in MongoDB');
      }
    } catch (error) {
      console.log('⚠️ Demo user creation failed:', error.message);
    }
  }
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`💾 Database: ${useDatabase ? 'MongoDB' : 'In-Memory'}`);
    console.log(`🌐 API: http://localhost:${PORT}/api`);
    console.log(`🧪 Test: http://localhost:${PORT}/api/test`);
    console.log(`🔑 Login: user@demo.com / password123`);
  });
};

startServer();