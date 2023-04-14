const express = require('express');
const router = express.Router();
const contributeQueries = require('../db/queries/contribute-queries');
const storyQueries = require('../db/queries/story-queries');
const manageQueries = require('../db/queries/manage-queries');

router.use((req, res, next) => {
  if (!req.session.userID) {
    return res.redirect('/login');
  }
  next();
});

router.get('/:id', (req, res) => {
  contributeQueries.getLatestWinnerData(req.params.id)
    .then(templateVars => {
      templateVars.userName = req.session.userName;
      res.render('new_contribution', templateVars);
    });
});

router.get('/edit/:id', (req, res) => {

  const contributionID = req.params.id;

  const getChapterInfoPromise = contributeQueries.getChapterData(contributionID);
  const getChapterPromise = storyQueries.getChapterFromContribution(contributionID);

  Promise.all([getChapterInfoPromise, getChapterPromise])
    .then(data => {
      const [chapterInfo, chapterData] = data;

      const templateVars = { userName: req.session.userName, contributionID, chapterInfo, chapterData };
      console.log(templateVars);
      res.render('edit_contribution', templateVars);
    })
    .catch(err => {
      console.log(err);
      res.render('error_page', { message: "Something went wrong.", userName: req.session.userName });
    });
});

router.post('/edit/:id', (req, res) => {

  const data = req.body;

  const contributionID = req.params.id;

  const chapter = {
    title: data.chapterTitle,
    body: data.chapterText,
  };

  contributeQueries.updateContribution(contributionID, chapter)
    .then(() => {
      return res.send(`Contribution updated`);
    })
    .catch(() => {
      res.send(false);
    });
});

router.post('/:storyID/:winner/:draftID/:publish', (req, res) => {

  const data = req.body;
  const publish = Boolean(req.params.publish);
  const draftID = req.params.draftID === "null" ? null : Number(req.params.draftID);

  const contribution = {
    storyID: req.params.storyID,
    contributorEmail: req.session.userID,
    title: data.chapterTitle,
    body: data.chapterText,
    published: publish
  };

  if (!draftID) {
    return contributeQueries.createNewContribution(contribution)
      .then(id => {
        res.send(String(id));
      })
      .catch((err) => {
        res.send(false);
      });
  }
  contributeQueries.saveContributionDraft(draftID, contribution)
    .then(() => {
      return res.send(String(draftID));
    })
    .catch(err => {
      console.log(err);
      res.send(false);
    });

});

router.post('/discard/', (req, res) => {
  contributeQueries.deleteContribution(draftID)
    .then(() => {
      res.send(true);
    })
    .catch(() => {
      res.send(false);
    });
});

router.post('/delete/', (req, res) => {
  contributeQueries.deleteContribution(draftID)
    .then(() => {
      res.redirect(req.get('referer'));
    })
    .catch(() => {
      res.render('error_page', { message: "Couldn't delete contribution. Please try again.", userName: req.session.userName });
    });
});

module.exports = router;
