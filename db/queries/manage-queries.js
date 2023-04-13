const db = require('../connection');

const setPublishedChapter = (chapterID, publish) => {
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
  return db.query(`UPDATE stories SET completed = $1 WHERE id = $2 RETURNING completed`, [close, storyID])
    .then(closed => {
      return closed.rows[0];
    })
    .catch(err => {
      console.log(err);
      return false;
    });
};

const getStoryData = (storyID) => {
  return db.query(`SELECT stories.story_title, stories.description, stories.category, stories.genre, stories.age_rating, chapters.title as chapter_title, chapters.body
  FROM stories
  JOIN chapters ON stories.chapter_id = chapters.id
  WHERE stories.id = $1`,
    [storyID])
    .then(data => {
      return data.rows[0];
    })
    .catch(err => {
      console.log(err);
      return false;
    });
};

module.exports = { setPublishedChapter, setCloseStory, getStoryData };
