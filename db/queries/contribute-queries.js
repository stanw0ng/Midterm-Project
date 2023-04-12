const db = require('../connection');
const userDb = require('./user-queries.js');

const getContributorID = userDb.getUserByEmail;

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

const getLatestWinnerData = (storyID) => {
  const output = {
    id: storyID
  };
  return db.query(`SELECT contributions.id as winner_id, contributor.name as contributor_name, chapters.title as chapter_title, stories.story_title, author.name as author
  FROM contributions
  JOIN users contributor ON contributions.contributor_id = contributor.id
  JOIN chapters ON contributions.chapter_id = chapters.id
  JOIN stories ON contributions.story_id = stories.id
  JOIN users author ON stories.author_id = author.id
  WHERE contributions.id = (SELECT child_id FROM chapter_relationships WHERE story_id = $1 ORDER BY child_id DESC LIMIT 1);`, [storyID])
    .then(result => {
      const data = result.rows[0];
      output.storyTitle = data.story_title,
        output.storyAuthor = data.author,
        output.lastWinnerID = data.winner_id,
        output.lastWinner = data.chapter_title,
        output.winnerAuthor = data.contributor_name;
      return output;
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

const saveContributionDraft = (draft_id, contribution) => {
  return db.query(`UPDATE chapters SET (title, body, published) = ($1, $2, $3) WHERE id = (SELECT chapter_id FROM contributions WHERE id = $4) RETURNING *;`,
    [contribution.title, contribution.body, contribution.published, draft_id])
    .then((result) => {
      if (!result.rows.length) {
        throw new Error("Could not find chapter ID to update.");
      }
      return true;
    });
};

const discardContribution = (draft_id) => {
  return db.query(`DELETE FROM contributions WHERE id = $1`, [draft_id])
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};

module.exports = { createNewContribution, saveContributionDraft, discardContribution, getLatestWinnerData };