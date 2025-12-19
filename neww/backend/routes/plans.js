const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const auth = require('../middleware/auth');

// Demo admin middleware
const demoAdminAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  // Handle demo admin token
  if (token === 'admin-token') {
    req.user = { role: 'admin', _id: 'demo-admin' };
    return next();
  }
  
  // Use regular auth for real users
  return auth(req, res, next);
};

// Get all plans
router.get('/all', async (req, res) => {
  try {
    const plans = await Plan.find({});
    const plansByOperator = {};
    
    plans.forEach(plan => {
      if (!plansByOperator[plan.operator]) {
        plansByOperator[plan.operator] = [];
      }
      plansByOperator[plan.operator].push(plan);
    });
    
    res.json({ plansByOperator, plans });
  } catch (error) {
    console.error('Plans fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new plan (admin only)
router.post('/add', demoAdminAuth, async (req, res) => {
  try {
    const { planId, operator, amount, validity, description, benefits, planType } = req.body;
    
    const plan = new Plan({
      planId,
      operator,
      amount,
      validity,
      description,
      benefits,
      planType
    });
    
    await plan.save();
    res.json(plan);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Plan ID already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Update plan (admin only)
router.put('/:id', demoAdminAuth, async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete plan (admin only)
router.delete('/:id', demoAdminAuth, async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    
    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;