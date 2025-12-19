const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/recharge-app');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  balance: { type: Number, default: 0 },
  role: { type: String, default: 'user' }
});

const User = mongoose.model('User', userSchema);

async function resetUsers() {
  await User.deleteMany({});
  
  const users = [
    {
      name: 'Demo User',
      email: 'user@demo.com',
      phone: '9876543210',
      password: await bcrypt.hash('password123', 12),
      balance: 1000,
      role: 'user'
    }
  ];

  await User.insertMany(users);
  console.log('✅ User created: user@demo.com / password123');
  process.exit(0);
}

resetUsers();