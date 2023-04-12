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

// renders page for root chapters
router.get("/:story_title", (req, res) => {
  const storyTitle = req.params.story_title;
  const getRootChapterPromise = storyQueries.getRootChapter(storyTitle)
  const getChildrenChaptersPromise = storyQueries.getChildrenChapters(storyTitle)

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

// renders page for chapters
router.get("/:story_title/chapter/:id", (req, res) => {
  const storyTitle = req.params.story_title;
  const contributionId = req.params.id;
  const getRootChapterPromise = storyQueries.getChapterData(contributionId);
  const getChildrenChaptersPromise = storyQueries.getChildrenChapters(storyTitle);

  Promise.all([getRootChapterPromise, getChildrenChaptersPromise])
    .then(data => {
      const [rootChapter, childrenChapters] = data;
      const templateVars = { rootChapter, childrenChapters };
      console.log(rootChapter)
      return res.render('read', templateVars);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error retrieving stories");
    });
});

// renders page for contributions
router.get("/:story_title/contributions", (req, res) => {
  return res.render('contributions');
});



module.exports = router;
