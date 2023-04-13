const express = require('express');
const router = express.Router();
const queries = require('../db/queries/contribute-queries');

router.use((req, res, next) => {
  if (!req.session.userID) {
    return res.redirect('/login');
  }
  next();
});

router.get('/:id', (req, res) => {
  queries.getLatestWinnerData(req.params.id)
    .then(templateVars => {
      templateVars.userName = req.session.userName;
      res.render('new_contribution', templateVars);
    })
});

router.post('/:id/:winner/:publish', (req, res) => {

  const data = req.body;
  const publish = Boolean(req.params.publish);

  console.log(req.params.id, req.params.winner);

  const contribution = {
    storyID: req.params.id,
    contributorEmail: req.session.userID,
    title: data.chapterTitle,
    body: data.chapterText,
    published: publish
  };

  if (!req.session.draftId) {
    return queries.createNewContribution(contribution)
    .then(id => {
        req.session.draftId = id;
        res.send(`Contribution saved`);
      })
      .catch((err) => {
        res.send(false);
      });
  }
  queries.saveContributionDraft(req.session.draftId, contribution)
  .then(() => {
    return res.send(`Contribution updated`);
  })
  .catch(err => {
    req.session.draftId = null;
    console.log(err);
    res.send(false);
  });

});

router.post('/discard/', (req, res) => {
  if(!req.session.draftId) {
    return res.send(true);
  }

  draftID = req.session.draftId;
  req.session.draftId = null;

  queries.discardContribution(draftID)
    .then(() => {
      res.send(true);
    });

});

module.exports = router;
