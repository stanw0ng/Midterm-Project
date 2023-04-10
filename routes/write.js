const express = require('express');
const router = express.Router();
const storyQueries = require('../db/queries/story-queries');

router.use((req, res, next) => {
  if (!req.session.userID) {
    return res.redirect('/login');
  }

  next();
});

router.get('/profile', (req, res) => {
  res.render('user_profile');
});

module.exports = router;
