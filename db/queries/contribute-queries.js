const db = require('../connection');
const userQueries = require('./user-queries.js');

const getContributorID = userQueries.getUserByEmail;

const insertNewChapter = (chapter) => {
  return db.query(`INSERT INTO chapters (title, body, published) VALUES ($1, $2, $3) RETURNING id`, chapter)
    .then(chapter => {
      return chapter.rows[0].id;
    });
};

const insertNewContribution = (contributorID, chapterID, storyID) => {
  return db.query(`INSERT INTO contributions (story_id, contributor_id, chapter_id) VALUES ($1, $2, $3) RETURNING id`,
    [storyID, contributorID, chapterID])
    .then(data => {
      return data.rows[0].id;
    })
    .catch((err) => {
      console.log(err);
    });
};

const linkChapterRelationship = (story, parent, child) => {
  return db.query(`INSERT INTO chapter_relationships (story_id, parent_id, child_id) VALUES ($1, $2, $3);`, [story, parent, child])
    .then(() => {
      return child;
    });
};

const getStoryData = (storyID => {
  return db.query(`SELECT stories.id, stories.story_title, author.name as author_name, chapters.title as chapter_title
  FROM stories
  JOIN users author ON stories.author_id = author.id
  JOIN chapters ON stories.chapter_id = chapters.id
  WHERE stories.id = $1`, [storyID])
  .then(data => {
    return data.rows[0];
  });
});

const getLatestWinnerData = (storyID) => {

  return db.query(`SELECT contributions.id as winner_id, contributor.name as contributor_name, chapters.title as chapter_title
  FROM contributions
  JOIN users contributor ON contributions.contributor_id = contributor.id
  JOIN chapters ON contributions.chapter_id = chapters.id
  WHERE contributions.id = (SELECT child_id FROM winners WHERE story_id = $1 ORDER BY child_id DESC LIMIT 1);`, [storyID])
    .then(result => {
      if (!result.rows.length) {
        return null;
      }
      return result.rows[0];
    });
};

const getChapterData = (contributionID) => {
  return db.query(`SELECT parent_author.name as parent_name, story_author.name as author_name, stories.story_title, chapters.title as chapter_title
  FROM contributions
  JOIN chapter_relationships ON chapter_relationships.child_id = contributions.id
  LEFT JOIN contributions parent ON chapter_relationships.parent_id = parent.id
  LEFT JOIN users parent_author ON parent_author.id = parent.contributor_id
  LEFT JOIN chapters ON chapters.id = parent.chapter_id
  JOIN stories ON stories.id = chapter_relationships.story_id
  JOIN users story_author ON stories.author_id = story_author.id
  WHERE contributions.id = $1;`, [contributionID])
    .then(chapterInfo => {
      return chapterInfo.rows[0];
    });
};

const createNewContribution = (contribution) => {
  let contributorID = null;

  return getContributorID(contribution.contributorEmail)
    .then(user => {
      contributorID = user.id;
    })
    .then(() => {
      return insertNewChapter([contribution.title, contribution.body, contribution.published])
        .then(newChapter => {
          return newChapter;
        });
    })
    .then(chapterID => {
      return insertNewContribution(contributorID, chapterID, contribution.storyID);
    })
    .then(childID => {
      console.log(contribution.storyID);
      return linkChapterRelationship(contribution.storyID, contribution.parentID, childID);
    })
    .then(id => {
      return id;
    });

};

const saveContributionDraft = (draft_id, chapter) => {
  const chapter_title = chapter.title ? chapter.title : "Chapter";
  return db.query(`UPDATE chapters SET (title, body, published) = ($1, $2, $3) WHERE id = (SELECT chapter_id FROM contributions WHERE id = $4) RETURNING *;`,
    [chapter_title, chapter.body, chapter.published, draft_id])
    .then((result) => {
      if (!result.rows.length) {
        throw new Error("Could not find chapter ID to update.");
      }
      return true;
    });
};

const updateContribution = (contributionID, chapter) => {
  const chapter_title = chapter.title ? chapter.title : "Chapter";
  return db.query(`UPDATE chapters SET (title, body) = ($1, $2) WHERE id = (SELECT chapter_id FROM contributions WHERE id = $3) RETURNING *;`,
    [chapter_title, chapter.body, contributionID])
    .then((result) => {
      if (!result.rows.length) {
        throw new Error("Could not find chapter ID to update.");
      }
      return true;
    });
};

const deleteContribution = (contribution_id) => {
  return db.query(`DELETE FROM contributions WHERE id = $1`, [contribution_id])
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};

module.exports = { createNewContribution, saveContributionDraft, deleteContribution, getLatestWinnerData, getChapterData, updateContribution, getStoryData };
