const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/recharge-app');

// User Schema
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

const User = mongoose.model('User', userSchema);

async function fixDemoUsers() {
  try {
    console.log('🔧 Fixing demo users...');
    
    // Delete existing demo users
    await User.deleteMany({ email: { $in: ['user@demo.com', 'admin@demo.com'] } });
    console.log('✅ Deleted existing demo users');
    
    // Create new demo users with correct password
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
    
    // Verify login
    const testUser = await User.findOne({ email: 'user@demo.com' });
    const isPasswordCorrect = await bcrypt.compare('password123', testUser.password);
    console.log('✅ Password verification:', isPasswordCorrect ? 'PASSED' : 'FAILED');
    
    console.log('🎉 Demo users are ready!');
    console.log('📧 Email: user@demo.com');
    console.log('🔑 Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixDemoUsers();