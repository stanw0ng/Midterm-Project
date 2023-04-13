const db = require('../connection');

const setPublishedChapter = (chapterID, publish) => {
  console.log(publish);
  return db.query(`UPDATE chapters SET published = $1 WHERE id = $2 RETURNING published`, [publish, chapterID])
    .then(published => {
      return published.rows[0];
    })
    .catch(err => {
      console.log(err);
      return false;
    });
};

const setCloseStory = (storyID, close) => {

};

module.exports = { setPublishedChapter, setCloseStory };
