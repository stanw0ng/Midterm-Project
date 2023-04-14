const express = require('express');
const router = express.Router();
const contributionQueries = require('../db/queries/contribution-read-queries');
const helperQueries = require('../db/queries/helper-queries');

router.get("/:id", (req, res) => {
  const contributionId = req.params.id;

  const contributionChapterPromise = contributionQueries.getContributionChapter(contributionId);
  const getUpvotesPromise = helperQueries.getUpvotes(contributionId);
  const getUserUpvotesPromise = helperQueries.getUserUpvotes(req.session.userID);


  Promise.all([contributionChapterPromise, getUpvotesPromise, getUserUpvotesPromise])
    .then(data => {
      const [chapter, totalUpvotes, upVoteArray] = data;

      if (!Object.keys(chapter).length) {
        return res.render('error_page', { userName: req.session.userName, message: "Could not find contribution chapter." });
      }

      const upvotes = [];
      upVoteArray.forEach(c => {
        upvotes.push(c.contribution_id);
      });

      const upvoted = upvotes.includes(Number(contributionId));

      console.log(chapter)

      const templateVars = chapter;
      templateVars.id = contributionId;
      templateVars.authorView = chapter.author_email === req.session.userID;
      templateVars.contributorView = chapter.contributor_email === req.session.userID;
      templateVars.signedIn = req.session.userID;
      templateVars.userName = req.session.userName;
      templateVars.upvotes = totalUpvotes;
      templateVars.upvoted = upvoted;
      templateVars.story_id = chapter.story_id;

      console.log(templateVars)

      res.render('contribution_page', templateVars);

    });

});

router.post("/delete/:id", (req, res) => {
  const entry_id = req.params.id;

  contributionQueries.deleteContribution(entry_id)
    .then(() => {
      res.redirect('/read');
    })
    .catch(err => {
      console.log(err);
      res.render('error_page', { message: err, userName: req.session.userName })
    });
});

router.post("/approve/", (req, res) => {
  const { entry_id } = req.body;

  contributionQueries.approveContribution(entry_id, req.session.userID)
    .then((id) => {
      console.log("Inserted into winners: ", id.rows[0]);
      res.send(true);
    })
    .catch(err => {
      console.log(err);
      res.render('error_page', { message: err, userName: req.session.userName })
    });
});

module.exports = router;
