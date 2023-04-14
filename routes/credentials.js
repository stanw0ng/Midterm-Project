/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const userQueries = require('../db/queries/user-queries');

const bcryptjs = require('bcryptjs');

router.get('/register', (req, res) => {
  const templateVars = {userName: null}
  res.render('register', templateVars);
});

router.get('/login', (req, res) => {
  const templateVars = {userName: null}
  res.render('login', templateVars);
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
      req.session.userName = user.name;
      res.redirect('/read');
    })
    .catch((err) => {
      res.render('error_page', { message: err, userName: null });
    });
});

router.post('/login', (req, res) => {

  const { email, password } = req.body;
  userQueries.getUserByEmail(email)
    .then((user) => {
      console.log(user);
      let err = null;
      if (!user || !bcryptjs.compareSync(password, user.hash)) {
        err = "Invalid login or password.";
      }

      if (err) {
        console.log(err);
        return res.render('error_page', { message: err, userName: null });
      }

      console.log("Login successful");
      req.session.userID = user.email;
      req.session.userName = user.name;
      res.redirect('/read');
    });
});

module.exports = router;
