const db = require('../connection');
const userDb = require('./user-queries.js');

const getUserID = userDb.getUserByEmail;

const updateUpvotes = (upvoteID, userEmail) => {
    return getUserID(userEmail)
        .then(user => {
            return db.query(`INSERT INTO upvotes (user_id, contribution_id) VALUES ($1, $2) RETURNING *`, [user.id, upvoteID]);
        })
        .then(() => {
            return db.query(`SELECT COUNT(id) FROM upvotes WHERE contribution_id = $1`, [upvoteID]);
        });
};

module.exports = { updateUpvotes };
