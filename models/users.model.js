const db = require("../db/connection");

exports.fetchUsers = () => {
  const queryString = `SELECT username, name, avatar_url FROM users`;

  return db.query(queryString).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return rows;
  });
};

exports.fetchUser = (username) => {
  const queryString = `SELECT * FROM users WHERE username = $1`;

  return db.query(queryString, [username]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Not found" });
    } else {
      return rows[0]
    }
  });
};
