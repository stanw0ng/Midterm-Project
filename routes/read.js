const express = require('express');
const router  = express.Router();
const storyQueries = require('../db/queries/story-queries');
const helperQueries = require('../db/queries/helper-queries');

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
router.get("/:storyId", (req, res) => {
  const storyId = req.params.storyId;
  const getRootChapterPromise = storyQueries.getRootChapter(storyId)
  const getChildrenChaptersPromise = storyQueries.getChildrenChapters(storyId)


  Promise.all([getRootChapterPromise, getChildrenChaptersPromise])
    .then(data => {
      const [rootChapter, childrenChapters] = data;
      const templateVars = { rootChapter, childrenChapters };
      console.log(templateVars)
      return res.render('read', templateVars);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error retrieving stories");
    });
});

// renders page for chapters
router.get("/:storyId/chapter/:contributionId", (req, res) => {
  const storyId = req.params.storyId;
  const contributionId = req.params.contributionId;
  const getRootChapterPromise = storyQueries.getChapterData(contributionId);
  const getChildrenChaptersPromise = storyQueries.getChildrenChapters(storyId);

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

// renders page for contributions
router.get("/:storyId/contributions", (req, res) => {
  const storyId = Number(req.params.storyId);
  const getStoryStatusPromise = storyQueries.getStoryStatus(storyId);
  const getContributionsByIdPromise = storyQueries.getContributionsById(storyId);

  Promise.all([getStoryStatusPromise, getContributionsByIdPromise])
    .then(data => {
    const [storyStatus, contributions] = data;
    const templateVars = {contributions, storyId, storyStatus}
    console.log(templateVars)
    return res.render('contributions', templateVars);
  })
  .catch(err => {
    console.error(err);
    res.status(500).send("Error retrieving contributions");
  });
});

// upvoting
router.post('/upvote', (req, res) => {
  helperQueries.updateUpvotes(req.body.upvoteID, req.session.userID)
    .then(count => {
      res.send(String(count.rows[0].count));
    })
});

module.exports = router;
