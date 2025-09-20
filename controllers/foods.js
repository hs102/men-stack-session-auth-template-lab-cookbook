const express = require('express');
const router = express.Router({ mergeParams: true });

const User = require('../models/user.js');

// INDEX - list pantry items for current user
router.get('/', async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!req.session.user || String(req.session.user._id) !== String(userId)) {
      return res.redirect('/auth/sign-in');
    }
    // Ensure the route corresponds to the user id in params, but use session for access control
    const currentUser = await User.findById(userId);
    if (!currentUser) return res.redirect('/');

    res.render('foods/index.ejs', { pantry: currentUser.pantry, userId });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// NEW - show form
router.get('/new', (req, res) => {
  const userId = req.params.userId;
  if (!req.session.user || String(req.session.user._id) !== String(userId)) {
    return res.redirect('/auth/sign-in');
  }
  res.render('foods/new.ejs', { userId });
});

// CREATE - add new item
router.post('/', async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!req.session.user || String(req.session.user._id) !== String(userId)) {
      return res.redirect('/auth/sign-in');
    }
    const currentUser = await User.findById(userId);
    if (!currentUser) return res.redirect('/');

    currentUser.pantry.push({ name: req.body.name });
    await currentUser.save();

    res.redirect(`/users/${userId}/foods`);
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// EDIT - form for a specific item
router.get('/:itemId/edit', async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    if (!req.session.user || String(req.session.user._id) !== String(userId)) {
      return res.redirect('/auth/sign-in');
    }
    const currentUser = await User.findById(userId);
    if (!currentUser) return res.redirect('/');

    const item = currentUser.pantry.id(itemId);
    if (!item) return res.redirect(`/users/${userId}/foods`);

    res.render('foods/edit.ejs', { userId, item });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// UPDATE - update a specific item
router.put('/:itemId', async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    if (!req.session.user || String(req.session.user._id) !== String(userId)) {
      return res.redirect('/auth/sign-in');
    }
    const currentUser = await User.findById(userId);
    if (!currentUser) return res.redirect('/');

    const item = currentUser.pantry.id(itemId);
    if (!item) return res.redirect(`/users/${userId}/foods`);

    item.set({ name: req.body.name });
    await currentUser.save();

    res.redirect(`/users/${userId}/foods`);
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// DELETE - remove a specific item
router.delete('/:itemId', async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    if (!req.session.user || String(req.session.user._id) !== String(userId)) {
      return res.redirect('/auth/sign-in');
    }
    const currentUser = await User.findById(userId);
    if (!currentUser) return res.redirect('/');

    currentUser.pantry.id(itemId)?.deleteOne();
    await currentUser.save();

    res.redirect(`/users/${userId}/foods`);
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

module.exports = router;
