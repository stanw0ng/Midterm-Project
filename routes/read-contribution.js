const express = require('express');
const router = express.Router();
const queries = require('../db/queries/contribution-read-queries');

router.get("/:id", (req, res) => {
  const contributionId = req.params.id;

  queries.getContributionChapter(contributionId)
    .then(result => {
      const templateVars = result;

      templateVars.id = contributionId;
      templateVars.authorView = result.author_email === req.session.userID;
      templateVars.contributorView = result.contributor_email === req.session.userID;
      templateVars.signedIn = req.session.userID;
      templateVars.userName = req.session.userName;


      res.render('contribution_page', templateVars);
    })
    .catch(err => {
      // TODO: res.redirect('error_page', {err});
      res.render('read', result);
    });
});

router.post("/delete/", (req, res) => {
  const { entry_id } = req.body;

  queries.deleteContribution(entry_id)
    .then(() => {
      res.redirect('/read');
    })
    .catch(err => {
      console.log(err);
      // TODO: res.redirect('error_page', {err});
    });
});

router.post("/approve/", (req, res) => {
  const { entry_id } = req.body;

  queries.approveContribution(entry_id, req.session.userID)
    .then((id) => {
      console.log("Inserted into winners: ", id.rows[0]);
      res.send(true);
    })
    .catch(err => {
      console.log(err);
      // TODO: res.redirect('error_page', {err});
    });
});

module.exports = router;
