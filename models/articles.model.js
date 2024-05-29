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

exports.fetchArticles = () => {
  const articlesDataToSelect =
    "articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url";
  let queryString = ` SELECT ${articlesDataToSelect}, CAST(COUNT(comments.article_id) AS INTEGER) AS comment_count FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.article_id ORDER BY articles.created_at DESC`;

  return db.query(queryString).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Not found" });
    } else {
      return rows;
    }
  });
};
