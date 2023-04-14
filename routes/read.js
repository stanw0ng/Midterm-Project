const express = require('express');
const router  = express.Router();
const storyQueries = require('../db/queries/story-queries');
const helperQueries = require('../db/queries/helper-queries');
const contributionQueries = require('../db/queries/contribution-read-queries');

// renders read splash page
router.get("/", (req, res) => {
  const getMyContributionsPromise = contributionQueries.getMyContributions(req.session.userID);
  const allStoriesPromise = storyQueries.getStories();
  const myStoriesPromise = storyQueries.getMyStories(req.session.userID);

  Promise.all([allStoriesPromise, myStoriesPromise, getMyContributionsPromise])
    .then(data => {
      const [allStories, myStories, myContributions] = data;
      const templateVars = { allStories, myStories, userName: req.session.userName, myContributions };
      console.log(templateVars)
      return res.render("read_index", templateVars);
    })
    .catch(err => {
      console.error(err);
      res.status(500).render('error_page', { message: err, userName: req.session.userName })
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
      const templateVars = { rootChapter, childrenChapters, userName: req.session.userName };
      if(!rootChapter){
        throw new Error("Unable to find story ID");
      }
      return res.render('read', templateVars);
    })
    .catch(err => {
      console.error(err);
      res.status(404).render('error_page', { message: err, userName: req.session.userName })
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
      const templateVars = { rootChapter, childrenChapters, userName: req.session.userName };
      return res.render('read', templateVars);
    })
    .catch(err => {
      console.error(err);
      res.status(404).render('error_page', { message: err, userName: req.session.userName })
    });
});

// renders page for contributions
router.get("/:storyId/contributions", (req, res) => {
  const storyId = req.params.storyId;
  const getStoryStatusPromise = storyQueries.getStoryStatus(storyId);
  const getContributionsByIdPromise = storyQueries.getContributionsById(storyId);
  const getUserUpvotesPromise = helperQueries.getUserUpvotes(req.session.userID);
  const getWinnersByStoryIdPromise = storyQueries.getWinnersByStoryId(storyId);

  Promise.all([getStoryStatusPromise, getContributionsByIdPromise, getUserUpvotesPromise, getWinnersByStoryIdPromise])
  .then(data => {
    const [storyStatus, contributions, upVoteArray, winnersArray] = data;

    // parses upVoteArray to more manageable data to access
    const upvotes = [];
    upVoteArray.forEach(c => {
      upvotes.push(c.contribution_id);
    });

    const winners = [];
    winnersArray.forEach(w => {
      winners.push(w.child_id);
    })

    const templateVars = {contributions, storyId, storyStatus, userName: req.session.userName, upvotes, winners}
    console.log(templateVars);
    return res.render('contributions', templateVars);
  })
  .catch(err => {
    console.error(err);
    res.status(404).render('error_page', { message: err, userName: req.session.userName })
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
