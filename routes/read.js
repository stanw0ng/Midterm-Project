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

// renders page for story starting from root chapter and chapters
router.get("/:id", (req, res) => {
  const storyId = req.params.id;
  const getRootChapterPromise = storyQueries.getRootChapter(storyId)
  const getChildrenChaptersPromise = storyQueries.getChildrenChapters(storyId)

  Promise.all([getRootChapterPromise, getChildrenChaptersPromise])
    .then(data => {
      const [rootChapter, childrenChapters] = data;
      const templateVars = { rootChapter, childrenChapters };
      return res.render('read', templateVars);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error retrieving stories");
    });
});


module.exports = router;
