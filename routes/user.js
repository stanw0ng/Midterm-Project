/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

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
