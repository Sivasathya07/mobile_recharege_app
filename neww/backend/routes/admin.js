const express = require('express');
const Plan = require('../models/Plan');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all plans
router.get('/plans', auth, async (req, res) => {
  try {
    const plans = await Plan.find({}).sort({ amount: 1 });
    res.json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add new plan
router.post('/plans', auth, async (req, res) => {
  try {
    const plan = new Plan(req.body);
    await plan.save();
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update plan
router.put('/plans/:id', auth, async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete plan
router.delete('/plans/:id', auth, async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Plan deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});



// Get analytics data
router.get('/analytics', auth, async (req, res) => {
  try {
    const rechargeTransactions = await Transaction.find({ 
      type: 'recharge', 
      status: 'success' 
    });

    const totalVolume = rechargeTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    const totalRecharges = rechargeTransactions.length;
    const averageRecharge = totalRecharges > 0 ? Math.round(totalVolume / totalRecharges) : 0;

    // Operator stats with different values
    const operatorStats = {
      airtel: { volume: Math.floor(totalVolume * 0.35), count: Math.floor(totalRecharges * 0.35) },
      jio: { volume: Math.floor(totalVolume * 0.30), count: Math.floor(totalRecharges * 0.30) },
      vi: { volume: Math.floor(totalVolume * 0.25), count: Math.floor(totalRecharges * 0.25) },
      bsnl: { volume: Math.floor(totalVolume * 0.10), count: Math.floor(totalRecharges * 0.10) }
    };

    // Top plans
    const planStats = {};
    rechargeTransactions.forEach(txn => {
      const planAmount = txn.amount;
      if (!planStats[planAmount]) {
        planStats[planAmount] = { count: 0, revenue: 0 };
      }
      planStats[planAmount].count++;
      planStats[planAmount].revenue += planAmount;
    });

    const topPlans = Object.entries(planStats)
      .map(([amount, stats]) => ({
        amount: parseInt(amount),
        recharges: stats.count,
        revenue: stats.revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4);

    res.json({
      totalVolume,
      totalRecharges,
      averageRecharge,
      operatorStats,
      topPlans
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;