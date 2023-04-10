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

router.post('/new/delete', (req, res) => {
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

router.post('/new/save', (req, res) => {
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

router.post('/new/publish', (req, res) => {
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

module.exports = router;
