const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  planId: {
    type: String,
    required: true,
    unique: true
  },
  operator: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  validity: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  benefits: [{
    type: String
  }],
  planType: {
    type: String,
    enum: ['fulltt', 'data', 'topup'],
    default: 'fulltt'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Plan', planSchema);