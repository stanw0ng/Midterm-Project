const db = require('../connection');

const getUserByEmail = (email) => {
  return db.query('SELECT * FROM users WHERE email = $1', [email])
    .then(user => {
      return user.rows[0];
    })
    .catch(err => {
      return null;
    });
}

const getUsers = () => {
  return db.query('SELECT * FROM users;')
    .then(data => {
      return data.rows;
    });
};

module.exports = { getUsers, getUserByEmail };
