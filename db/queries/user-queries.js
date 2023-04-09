const db = require('../connection');

const addUserToDatabase = (user) => {
  return db.query(`INSERT INTO users (name, email, hash) VALUES ($1, $2, $3) RETURNING *`, [user.name, user.email, user.hash])
    .then(user => {
      return user.rows[0];
    });
};

const registerNewUser = (user) => {
  return db.query(`SELECT * FROM users WHERE email = $1`, [user.email])
    .then(users => {
      if(users.rows.length > 0) {
        throw new Error('A user with that email already exists.');
      }
      return addUserToDatabase(user)
        .then(user => {
          return user;
        });
    });
};

const getUserByEmail = (email) => {
  return db.query(`SELECT * FROM users WHERE email = $1`, [email])
    .then(user => {
      return user.rows[0];
    })
    .catch(err => {
      return null;
    });
};

const getUsers = () => {
  return db.query('SELECT * FROM users;')
    .then(data => {
      return data.rows;
    });
};

module.exports = { getUsers, getUserByEmail, registerNewUser };
