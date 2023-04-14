const db = require('../connection');
const userDb = require('./user-queries.js');

const getUser = userDb.getUserByEmail;

const getContributionChapter = (contributionId) => {
  return db.query(`SELECT story.story_title as story_title, story.id as story_id, author.name as author_name, author.email as author_email, chapters.title as chapter_title, contributor.name as contributor_name, contributor.email as contributor_email, contributions.date_created as publish_date, chapters.body
  FROM contributions
  JOIN users contributor ON contributions.contributor_id = contributor.id
  JOIN stories story ON contributions.story_id = story.id
  JOIN users author ON story.author_id = author.id
  JOIN chapters ON contributions.chapter_id = chapters.id
  WHERE contributions.id = $1;`, [contributionId])
    .then(result => {
      if (!result.rows.length) {
        return {};
      }
      return result.rows[0];
    });
};

const getContributionsByTitle = (storyTitle) => {
  return db.query(`
  SELECT contributions.id, TO_CHAR(contributions.date_created, 'FMMM/DD/YY, HH:MI:SS') AS publish_date, chapters.title, users.name, COUNT(upvotes.user_id) AS upvotes
  FROM contributions
  JOIN users ON contributions.contributor_id = users.id
  LEFT JOIN upvotes ON upvotes.contribution_id = contributions.id
  JOIN stories ON contributions.story_id = stories.id
  JOIN chapters ON contributions.chapter_id = chapters.id
  WHERE stories.story_title = $1
  GROUP BY contributions.id, chapters.title, users.name
  `, [storyTitle])
    .then(contributions => {
      return contributions.rows;
    })
    .catch(err => {
      return null;
    });
};

const approveContribution = (entryID, userEmail) => {
  console.log(entryID, userEmail);
  return getUser(userEmail)
    .then(user => {
      const userID = user.id;
      return db.query(`SELECT contributions.story_id, chapter_relationships.parent_id
      FROM contributions
      JOIN chapter_relationships ON contributions.id = chapter_relationships.child_id
      JOIN stories ON contributions.story_id = stories.id
      WHERE contributions.id = $1 AND stories.author_id = $2`, [entryID, userID]);
    })
    .then(contribution => {
      if(contribution.rows.length) {
        const entry = contribution.rows[0];
        return db.query(`INSERT INTO winners (story_id, parent_id, child_id) VALUES ($1, $2, $3) RETURNING id`, [entry.story_id, entry.parent_id, entryID]);
      }
    })
    .catch((err) => {
      console.error(err);
      throw "Could not approve entry.";
    });
};


const deleteContribution = (entry_id) => {
  return db.query(`DELETE FROM contributions WHERE id = $1`, [entry_id])
    .then(() => {
      return true;
    })
    .catch((err) => {
      throw err;
    });
};


const getMyContributions = (userEmail) => {
  let userID = null;
  return getUser(userEmail)
    .then(user => {
      userID = user.id;
      return db.query(`
      SELECT chapters.*, contributions.id AS contribution_id
      FROM contributions
      JOIN chapters ON chapters.id = contributions.chapter_id
      WHERE contributions.contributor_id = $1
      `, [userID])
      .then(contributions => {
        return contributions.rows;
      })
      .catch(err => {
        return null;
      });
    });
};

module.exports = { getContributionChapter, getContributionsByTitle, approveContribution, deleteContribution, getMyContributions };
