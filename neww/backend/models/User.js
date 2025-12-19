const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const favoriteSchema = new mongoose.Schema({
  nickname: { type: String, required: true },
  number: { type: String, required: true },
  operator: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String },
  balance: { type: Number, default: 1000 },
  favorites: [favoriteSchema],
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String },
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
      language: { type: String, default: 'English' },
      currency: { type: String, default: 'INR' }
    },
  resetPasswordToken: String,
  resetPasswordExpires: Date
  }, { timestamps: true });

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);