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
  return db.query(`SELECT stories.id as story_id, stories.story_title, stories.description, stories.category, stories.genre, stories.age_rating, chapters.title as chapter_title, chapters.body
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

const updateStory = (story, chapter) => {
  return db.query(`UPDATE stories SET (story_title, description, category, genre, age_rating) = ($1, $2, $3, $4, $5) WHERE id = $6 RETURNING chapter_id`,
    [story.title, story.description, story.category, story.genre, story.rating, story.id])
    .then(chapter_query => {
      return db.query(`UPDATE chapters SET (title, body) = ($1, $2) WHERE id = $3`, [chapter.title, chapter.body ,chapter_query.rows[0].chapter_id]);
    })
    .then(() => {
      return true;
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = { setPublishedChapter, setCloseStory, getStoryData, updateStory };
