const express = require('express');
const router  = express.Router();
const storyQueries = require('../db/queries/story-queries');

// renders read splash page
router.get("/", (req, res) => {
  const allStoriesPromise = storyQueries.getStories();
  const myStoriesPromise = storyQueries.getMyStories(req.session.userID);

  Promise.all([allStoriesPromise, myStoriesPromise])
    .then(data => {
      const [allStories, myStories] = data;
      const templateVars = { allStories, myStories };
      return res.render("read_index", templateVars);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error retrieving stories");
    });
});

router.get('/:id', (req, res) => {
  return res.render('read_story', templateVars)
});

module.exports = router;
