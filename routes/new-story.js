const express = require('express');
const router = express.Router();
const writeQueries = require('../db/queries/write-queries');
const { Template } = require('ejs');

router.use((req, res, next) => {
  if (!req.session.userID) {
    return res.redirect('/login');
  }
  next();
});

router.get('/new', (req, res) => {
  const templateVars = {userName: req.session.userName}
  res.render('new_story', templateVars);
});

router.post('/save/:publish', (req, res) => {
  const data = req.body;
  const publish = req.params.publish === "true" ? true : false;

  const chapter = {
    title: data.chapterTitle,
    body: data.chapterText,
    published: publish
  };

  const story = {
    title: data.storyTitle,
    description: data.description,
    category: data.category,
    genre: data.genre,
    rating: data.rating
  };

  console.log(publish);
  if (!req.session.draftId) {
    return writeQueries.saveNewStory(req.session.userID, chapter, story)
    .then(id => {
        if(!publish) {
          req.session.draftId = id;
        }
        res.send(`New story saved`);
      })
      .catch((err) => {
        res.send(false);
      });
  }
  writeQueries.saveExistingStory(req.session.draftId, req.session.userID, chapter, story)
  .then(() => {
    if(publish) {
      req.session.draftId = null;
    }
    return res.send(`Draft saved`);
  })
  .catch(() => {
    res.send(false);
  });

});

router.post('/discard/', (req, res) => {

  writeQueries.deleteStory(req.session.draftId)
  .then(() => {
      req.session.draftId = null;
      res.redirect('/read');
    });

});

module.exports = router;
