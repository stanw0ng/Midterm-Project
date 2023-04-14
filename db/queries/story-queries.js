const db = require('../connection');

// fetches all stories
const getStories = () => {
  return db.query(`
  SELECT stories.story_title, stories.id, TO_CHAR(stories.date_created, 'FMMM/DD/YY, HH:MI:SS') AS publish_date,
  stories.description, stories.category, stories.genre, stories.age_rating, stories.completed, users.name
  FROM stories
  JOIN users ON users.id = stories.author_id
  JOIN chapters ON stories.chapter_id = chapters.id
  WHERE chapters.published IS TRUE
  ORDER BY date_created DESC`)
    .then(user => {
      return user.rows;
    })
    .catch(err => {
      return null;
    });
};

// fetches all stories created by current user
const getMyStories = (userId) => {
  return db.query(`SELECT stories.*, TO_CHAR(stories.date_created, 'FMMM/DD/YY, HH:MI:SS') AS publish_date, chapters.published FROM stories
  JOIN users ON stories.author_id = users.id
  JOIN chapters ON stories.chapter_id = chapters.id
  WHERE users.email = $1;`, [userId])
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
  SELECT stories.story_title, TO_CHAR(stories.date_created, 'FMMM/DD/YY, HH:MI:SS') AS publish_date, chapters.title, stories.id , chapters.body, users.name
  FROM stories
  JOIN users ON stories.author_id = users.id
  JOIN chapters ON stories.chapter_id = chapters.id
  WHERE stories.id = $1
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
  SELECT winners.child_id, chapters.title
  FROM winners
  JOIN contributions ON winners.child_id = contributions.id
  JOIN chapters ON contributions.chapter_id = chapters.id
  WHERE winners.story_id = $1
  `, [storyId])
    .then(chapters => {
      return chapters.rows;
    })
    .catch(err => {
      return null;
    });
};

const getChapterData = (contributionsId) => {
  return db.query(`
  SELECT chapters.body, stories.story_title, root_chapter.title AS root_chapter_title, chapters.title, users.name, TO_CHAR(contributions.date_created, 'FMMM/DD/YY, HH:MI:SS') AS publish_date, stories.id
  FROM contributions
  JOIN chapters ON contributions.chapter_id = chapters.id
  JOIN users ON contributions.contributor_id = users.id
  LEFT JOIN stories ON contributions.story_id = stories.id
  LEFT JOIN chapters AS root_chapter ON stories.chapter_id = root_chapter.id
  WHERE contributions.id = $1
  `, [contributionsId])
    .then(data => {
      return data.rows[0];
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

const getChapterFromContribution = (contribution_id) => {
  return db.query(`SELECT chapters.title as chapter_title, chapters.body as chapter_text
  FROM chapters
  JOIN contributions ON contributions.chapter_id = chapters.id
  WHERE contributions.id = $1`, [contribution_id])
    .then(result => {
      return result.rows[0];
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

const getStoryStatus = (story_id) => {
  return db.query(`SELECT stories.completed FROM stories WHERE id = $1`, [story_id])
    .then(contributions => {
      return contributions.rows;
    })
    .catch(err => {
      return null;
    });
};

const getContributionsById = (storyId) => {
  return db.query(`
  SELECT contributions.id AS contributions_id, TO_CHAR(contributions.date_created, 'FMMM/DD/YY, HH:MI:SS') AS publish_date, chapters.title, users.name, COUNT(upvotes.user_id) AS upvotes
  FROM contributions
  JOIN users ON contributions.contributor_id = users.id
  LEFT JOIN upvotes ON upvotes.contribution_id = contributions.id
  JOIN stories ON contributions.story_id = stories.id
  JOIN chapters ON contributions.chapter_id = chapters.id
  WHERE stories.id = $1
  GROUP BY contributions_id, chapters.title, users.name
  `, [storyId])
    .then(contributions => {
      return contributions.rows;
    })
    .catch(err => {
      return null;
    });
};

const getWinnersByStoryId = (storyId) => {
  return db.query(`
  SELECT winners.child_id
  FROM winners
  WHERE story_id = $1
  `, [storyId])
  . then(winners => {
    return winners.rows;
  })
  .catch(err => {
    return null;
  });
};

module.exports = { getStories, getMyStories, getRootChapter, getChildrenChapters, getChapterData, getChapter, getBookmarkedStories, getUserContributions, getStoryContributions, getStoryStatus, getContributionsById, getWinnersByStoryId, getChapterFromContribution };
