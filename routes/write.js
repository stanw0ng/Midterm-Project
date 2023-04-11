const express = require('express');
const router = express.Router();
const writeQueries = require('../db/queries/write-queries');

router.use((req, res, next) => {
  if (!req.session.userID) {
    return res.redirect('/login');
  }
  next();
});

router.get('/new', (req, res) => {
  res.render('new_story');
});

router.post('/new', (req, res) => {
  const data = req.body;
  const chapter = {
    title: data.chapterTitle,
    body: data.chapterText
  };
  const story = {
    title: data.storyTitle,
    description: data.description,
    category: data.category,
    genre: data.genre,
    rating: data.rating
  };

  writeQueries.saveNewStory(req.session.userID, chapter, story).then(console.log("New story inserted successfully!"));

  res.render('user_profile');
});

router.post('/delete', (req, res) => {
  const data = req.body;

  const chapter = {
    title: data.chapterTitle,
    body: data.chapterText
  };

  const story = {
    title: data.storyTitle,
    description: data.description,
    category: data.category,
    genre: data.genre
  };

});

router.post('/save/:publish', (req, res) => {
  const data = req.body;
  const publish = Boolean(req.params.publish);

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

  if (!req.session.draftId) {
    return writeQueries.saveNewStory(req.session.userID, chapter, story)
    .then(id => {
        req.session.draftId = id;
        res.send(`New story saved`);
      })
      .catch((err) => {
        res.send(false);
      });
  }
  writeQueries.saveExistingStory(req.session.draftId, req.session.userID, chapter, story)
  .then(() => {
    return res.send(`Draft saved`);
  })
  .catch(() => {
    res.send(false);
  });

});

router.post('/discard/', (req, res) => {

  draftID = req.session.draftId;
  req.session.draftId = null;

  writeQueries.discardStoryDraft(draftID)
    .then((result) => {
      res.send(result);
    });

});

module.exports = router;
