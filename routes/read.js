const express = require('express');
const router  = express.Router();
const storyQueries = require('../db/queries/story-queries');


// renders read splash page
router.get("/", (req, res) => {
  res.render('read_index')
});


module.exports = router;
