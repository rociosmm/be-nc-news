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

exports.addTopic = ({ slug, description }) => {
  if (!slug || !description) {
    return Promise.reject({ status: 400, msg: "Bad Request: missing data" });
  }

  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [slug])
    .then(({ rows }) => {
      if (rows.length === 0) {
        const topicArr = [slug, description];
        const queryString = `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *`;

        return db
          .query(queryString, topicArr)
          .then(({ rows }) => {
            return rows[0];
          })
          .catch((err) => console.log("err posting topic :>> ", err));
      } else {
        return Promise.reject({
          status: 400,
          msg: "Bad Request: topic duplicated",
        });
      }
    })
};
