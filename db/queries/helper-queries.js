const db = require('../connection');
const userDb = require('./user-queries.js');

const getUserID = userDb.getUserByEmail;

const updateUpvotes = (upvoteID, userEmail) => {
  let userID = null;
  return getUserID(userEmail)
    .then(user => {
      userID = user.id;
      //Check if upvotes has this user and contribution pairing
      return db.query(`SELECT * FROM upvotes WHERE user_id = $1 AND contribution_id = $2`, [userID, upvoteID]);
    })
    .then(upvote => {
      //If there is no matching user - contribution pairing...
      if (!upvote.rows.length) {
        //Insert upvote
        return db.query(`INSERT INTO upvotes (user_id, contribution_id) VALUES ($1, $2) RETURNING *`, [userID, upvoteID]);
      }
      //If there is a pariring, remove the upvote from the table
      return db.query(`DELETE FROM upvotes WHERE id = $1`, [upvote.rows[0].id]);
    })
    .then(() => {
      //Count all upvotes for contribution and return number
      return db.query(`SELECT COUNT(id) FROM upvotes WHERE contribution_id = $1`, [upvoteID]);
    });
};

//Get all of the user's votes to check against the contribution cards
const getUserUpvotes = (userEmail) => {
  return getUserID(userEmail)
    .then(user => {
      return db.query(`SELECT contribution_id FROM upvotes WHERE user_id = $1`, [user.id]);
    })
    .then(upvotes => {
      return upvotes.rows;
    })
    .catch(err => {
      console.log(err);
      return [];
    });
};

module.exports = { updateUpvotes, getUserUpvotes };
