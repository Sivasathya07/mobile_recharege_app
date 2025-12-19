const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, avatar },
      { new: true }
    ).select('-password -twoFactorSecret');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update password
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const { emailNotifications, smsNotifications, language, currency } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        preferences: {
          emailNotifications,
          smsNotifications,
          language,
          currency
        }
      },
      { new: true }
    ).select('-password -twoFactorSecret');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add favorite
router.post('/favorites', auth, async (req, res) => {
  try {
    const { nickname, number, operator } = req.body;
    
    const user = await User.findById(req.user.id);
    user.favorites.push({ nickname, number, operator });
    await user.save();

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update favorite
router.put('/favorites/:id', auth, async (req, res) => {
  try {
    const { nickname, number, operator } = req.body;
    
    const user = await User.findById(req.user.id);
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete favorite
router.delete('/favorites/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.favorites.pull(req.params.id);
    await user.save();

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;