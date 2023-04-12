const db = require('../connection');
const userDb = require('./user-queries.js');

const getContributorID = userDb.getUserByEmail;

const insertNewChapter = (chapter) => {
  return db.query(`INSERT INTO chapters (title, body, published) VALUES ($1, $2, $3) RETURNING id`, chapter)
    .then(chapter => {
      return chapter.rows[0].id;
    });
};

const updateContributionChapter = (draft_id, chapter) => {
  return db.query(`UPDATE chapters SET (title, body, published) = ($1, $2, $3) WHERE id = (SELECT chapter_id FROM stories WHERE id = $4);`, [...chapter, draft_id])
    .then(() => {
      return true;
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

// TO DO
const getLatestWinner = (storyID) => {
  return db.query(`SELECT child_id FROM chapter_relationships WHERE story_id = 1 ORDER BY child_id DESC LIMIT 1;`)
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

const saveContributionDraft = (draft_id, author_email, contribution) => {
  let contributorID = null;

  return getContributorID(author_email)
    .then(user => {
      contributorID = user.id;
    })
    .then(() => {
      return updateContributionChapter(draft_id, [contribution.title, contribution.body, contribution.published]);
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

module.exports = { createNewContribution, saveContributionDraft, discardContribution };
