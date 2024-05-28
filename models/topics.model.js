const db = require("../db/connection");

exports.fetchTopics = () => {
  const queryString = "SELECT * FROM topics;";

  return db.query(queryString).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    } else {
      return rows;
    }
  });
};
