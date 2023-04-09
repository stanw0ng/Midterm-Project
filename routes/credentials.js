/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const userQueries = require('../db/queries/user-queries');

const bcryptjs = require('bcryptjs');

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/logout', (req, res) => {
  req.session = null;
  res.redirect(`/login`);
});

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcryptjs.hashSync(password);

  userQueries.registerNewUser({ name, email, hash })
    .then((user) => {
      console.log("Registration successful", user);
      req.session.userID = user.email;
      res.redirect('/user/profile');
    })
    .catch((err) => {
      res.redirect('/register');
    });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  userQueries.getUserByEmail(email)
    .then((user) => {
      let error = null;
      if(!user || !bcryptjs.compareSync(password, user.hash)) {
        error = "Invalid login or password.";
      }

      if(error) {
        console.log(error);
        return res.redirect('/login');
      }

      console.log("Login successful");
      req.session.userID = user.email;
      res.redirect('/user/profile');
    });
});

module.exports = router;
