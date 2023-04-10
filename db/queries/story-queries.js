const db = require('../connection');

const getStories = (limit = 10) => {
  return db.query(`SELECT * FROM stories ORDER BY date_created DESC LIMIT $1;`, [limit])
    .then(user => {
      return user.rows;
    })
    .catch(err => {
      return null;
    });
};

const getMyStories = (userId) => {
  return db.query('SELECT * FROM stories JOIN users ON author_id = users.id WHERE email = $1', [userId])
    .then(res => {
     return res.rows;
    })
    .catch(err => {
      return null;
    });
};

const getChapter = (chapter_id) => {
  return db.query(`SELECT title, text FROM chapters WHERE chapter_id = $1`, [chapter_id])
    .then(user => {
      return user.rows;
    })
    .catch(err => {
      return null;
    });
};

const getBookmarkedStories = (user_id) => {
  return db.query(`SELECT stories.* FROM stories JOIN bookmarks ON stories.id = bookmarks.story_id WHERE bookmarks.user_id = $1`, [user_id]);
};

const getUserContributions = (user_id) => {
  return db.query(`SELECT contributions.* FROM contributions WHERE contributor_id = $1`, [user_id]);
};

const getStoryContributions = (story_id) => {
  return db.query(`SELECT contributions.* FROM contributions WHERE story_id = $1`, [story_id]);
};

module.exports = { getStories, getMyStories, getChapter, getBookmarkedStories, getUserContributions, getStoryContributions };
