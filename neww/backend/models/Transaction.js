const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['recharge', 'wallet_add', 'wallet_deduct'], required: true },
  amount: { type: Number, required: true },
  phoneNumber: { type: String },
  number: { type: String },
  operator: { type: String },
  plan: {
    name: String,
    validity: String,
    data: String,
    talktime: String
  },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  transactionId: { type: String, unique: true },
  paymentMethod: { type: String },
  description: { type: String }
}, { timestamps: true });

// Virtual field for date (uses createdAt)
transactionSchema.virtual('date').get(function() {
  return this.createdAt;
});

// Virtual field for id (uses _id)
transactionSchema.virtual('id').get(function() {
  return this._id.toString();
});

// Ensure virtual fields are serialized
transactionSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);