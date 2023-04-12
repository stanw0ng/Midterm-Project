const express = require('express');
const router = express.Router();
const queries = require('../db/queries/contribute-queries');

// router.use((req, res, next) => {
//   if (!req.session.userID) {
//     return res.redirect('/login');
//   }
//   next();
// });

router.get('/:id', (req, res) => {
  const templateVars = {
    id: req.params.id,
    storyTitle: 'Dracula',
    storyAuthor: 'Bram Stoker',
    lastWinnerID: 1,
    lastWinner: 'Chapter 2',
    winnerAuthor: 'Mary Shelley'
  };
  res.render('new_contribution', templateVars);
});

router.post('/:id/:publish', (req, res) => {

  const data = req.body;
  const publish = Boolean(req.params.publish);

  console.log(req.body.storyID, req.body.lastChapter);

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
        res.send(`New story saved`);
      })
      .catch((err) => {
        res.send(false);
      });
  }
  queries.saveContributionDraft(req.session.draftId, contribution)
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

  queries.discardContribution(draftID)
    .then((result) => {
      res.send(result);
    });

});

module.exports = router;
