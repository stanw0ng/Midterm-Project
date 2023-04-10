const db = require('../connection');
const userDb = require('./user-queries.js');

const getAuthorID = userDb.getUserByEmail;

const insertNewChapter = (chapter) => {
  return db.query(`INSERT INTO chapters (title, body) VALUES ($1, $2) RETURNING id`, [chapter.title, chapter.body])
    .then(chapter => {
      return chapter.rows[0].id;
    });
};

const insertNewStory = (authorID, chapterID, story) => {
  db.query(
    `INSERT INTO stories (author_id, chapter_id, story_title, description, category, genre, age_rating) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [authorID, chapterID, story.title, story.description, story.category, story.genre, story.rating]
  );
};

const saveNewStory = (author_email, chapter, story) => {
  let authorID = null;
  let chapterID = null;

  return getAuthorID(author_email)
    .then(author => {
      authorID = author.id;
    })
    .then(() => {
      insertNewChapter(chapter)
        .then(newChapter => {
          chapterID = newChapter;
        });
    })
    .then(() => {
      insertNewStory(authorID, chapterID, story);
    });

};

const getStories = (limit = 10) => {
  return db.query(`SELECT * FROM stories ORDER BY date_created DESC LIMIT $1;`, [limit])
    .then(user => {
      return user.rows;
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

module.exports = { saveNewStory };
