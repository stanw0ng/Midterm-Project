const db = require('../connection');
const userDb = require('./user-queries.js');

const getAuthorID = userDb.getUserByEmail;

const insertNewChapter = (chapter) => {
  return db.query(`INSERT INTO chapters (title, body, published) VALUES ($1, $2, $3) RETURNING id`, [chapter.title, chapter.body, chapter.published])
    .then(chapter => {
      return chapter.rows[0].id;
    });
};

const updateStoryChapter = (draft_id, chapter) => {
  return db.query(`UPDATE chapters SET (title, body, published) = ($1, $2, $3) WHERE id = (SELECT chapter_id FROM stories WHERE id = $4) RETURNING id;`, [chapter.title, chapter.body, chapter.published, draft_id]);
};

const insertNewStory = (authorID, chapterID, story) => {
  return db.query(`INSERT INTO stories (author_id, chapter_id, story_title, description, category, genre, age_rating) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
    [authorID, chapterID, story.title, story.description, story.category, story.genre, story.rating])
    .then(data => {
      return data.rows[0].id;
    })
    .catch((err) => {
      console.log(err);
    });
};

const saveNewStory = (author_email, chapter, story) => {
  let authorID = null;
  // let chapterID = null;

  return getAuthorID(author_email)
    .then(author => {
      authorID = author.id;
    })
    .then(() => {
      return insertNewChapter(chapter)
        .then(newChapter => {
          return newChapter;
        });
    })
    .then((chapterID) => {
      return insertNewStory(authorID, chapterID, story);
    })
    .then(id => {
      return id;
    });

};

const saveExistingStory = (draft_id, author_email, chapter) => {
  let authorID = null;

  return getAuthorID(author_email)
    .then(author => {
      authorID = author.id;
    })
    .then(() => {
      return updateStoryChapter(draft_id, chapter);
    });
};

const deleteStory = (draft_id) => {
  return db.query(`DELETE FROM stories WHERE id = $1`, [draft_id])
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};

module.exports = { saveNewStory, saveExistingStory, deleteStory };
