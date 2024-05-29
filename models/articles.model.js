const db = require("../db/connection");

exports.fetchArticle = (article_id) => {
  let queryString = "SELECT * FROM articles WHERE article_id = $1";
  return db.query(queryString + ";", [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    } else {
      return rows[0];
    }
  });
};
