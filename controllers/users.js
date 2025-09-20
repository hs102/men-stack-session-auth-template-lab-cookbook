const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

// Community index - list all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.render('users/index.ejs', { users });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// Show another user's pantry (read-only)
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.redirect('/users');

    res.render('users/show.ejs', { profile: user });
  } catch (err) {
    console.error(err);
    res.redirect('/users');
  }
});

module.exports = router;
