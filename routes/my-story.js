const express = require('express');
const router = express.Router();
const writeQueries = require('../db/queries/write-queries');
const manageQueries = require('../db/queries/manage-queries');

router.use((req, res, next) => {
  if (!req.session.userID) {
    return res.redirect('/login');
  }
  next();
});

router.post('/delete/:id', (req, res) => {
  const storyID = req.params.id;

  writeQueries.deleteStory(storyID)
    .then(() => {
      res.redirect('/read');
    });
});

router.post('/publish/:chapter/:publish', (req, res) => {
  const chapterID = req.params.chapter;
  const publish = req.params.publish === 'true' ? true : false;

  manageQueries.setPublishedChapter(chapterID, publish)
    .then((result) => {
      if (!result) {
        return res.render('/error', { message: "Something went wrong. Could not change published status." });
      }
      res.redirect('/read');
    });
  });

  router.post('/close/:id/:close', (req, res) => {
    const storyID = req.params.id;
    const close = req.params.close;

    manageQueries.setCloseStory(storyID, close)
    .then((result) => {
      if(!result) {
        return res.redirect('/read');
      }
      res.redirect('/read');
    });
});


module.exports = router;
