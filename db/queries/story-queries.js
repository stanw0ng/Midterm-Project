const db = require('../connection');

// fetches all stories
const getStories = (limit = 10) => {
  return db.query(`SELECT * FROM stories ORDER BY date_created DESC LIMIT $1;`, [limit])
    .then(user => {
      return user.rows;
    })
    .catch(err => {
      return null;
    });
};

// fetches all stories created by current user
const getMyStories = (userId) => {
  return db.query('SELECT * FROM stories JOIN users ON author_id = users.id WHERE email = $1', [userId])
    .then(res => {
     return res.rows;
    })
    .catch(err => {
      return null;
    });
};

// fetch root data for a story
const getRootChapter = (storyId) => {
  return db.query(`
  SELECT stories.story_title, chapters.title, chapters.id, chapters.body, users.name
  FROM stories
  JOIN users ON stories.author_id = users.id
  JOIN chapters ON stories.chapter_id = chapters.id
  WHERE stories.story_title = $1
  `, [storyId])
    .then(res => {
     return res.rows[0];
    })
    .catch(err => {
      return null;
    });
};

// WIP should fetch winning contributions
const getChildrenChapters = (storyId) => {
  return db.query(`
  SELECT winners.child_id, chapters.title, chapters.id
  FROM winners
  JOIN stories ON winners.story_id = stories.id
  JOIN contributions ON winners.child_id = contributions.id
  JOIN chapters ON contributions.chapter_id = chapters.id
  WHERE stories.story_title = $1
  ORDER BY winners.child_id
  `, [storyId])
  .then(user => {
    return user.rows;
  })
  .catch(err => {
    return null;
  });
}

const getChapterData = (contributionsId) => {
  return db.query(`
SELECT chapters.body, stories.story_title, root_chapter.title AS root_chapter_title, chapters.title, users.name
FROM contributions
JOIN chapters ON contributions.chapter_id = chapters.id
JOIN users ON contributions.contributor_id = users.id
LEFT JOIN stories ON contributions.story_id = stories.id
LEFT JOIN chapters AS root_chapter ON stories.chapter_id = root_chapter.id
WHERE contributions.id = $1
  `, [contributionsId])
    .then(user => {
      return user.rows[0];
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

module.exports = { getStories, getMyStories, getRootChapter, getChildrenChapters, getChapterData, getChapter, getBookmarkedStories, getUserContributions, getStoryContributions };
