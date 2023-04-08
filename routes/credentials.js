/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const userQueries = require('../db/queries/user-queries');

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

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  userQueries.getUserByEmail(email)
    .then((user) => {

      if(!user) {
        console.log("No such user");
        return res.redirect('/login');
      }

      if(password != user.password) {
        console.log("Password mismatch");
        return res.redirect('/login');
      }
      console.log("Login successful");
      req.session.userID = user.email;
      res.redirect('/user/profile');
    });
});

router.post('/register', (req, res) => {
  userQueries.registerNewUser(req.body)
    .then((user) => {
      console.log("Registration successful", user);
      req.session.userID = user.email;
      res.redirect('/user/profile');
    })
    .catch((err) => {
      res.redirect('/register');
    });
});

module.exports = router;
