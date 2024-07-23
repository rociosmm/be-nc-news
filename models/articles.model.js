const format = require("pg-format");
const db = require("../db/connection");

exports.fetchArticle = (article_id) => {
  const queryString = `SELECT articles.*, CAST(COUNT(comments.article_id) AS INTEGER) AS comments_count FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id`;

  return db.query(queryString, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    } else {
      return rows[0];
    }
  });
};

exports.fetchArticles = (
  sort_by = "created_at",
  order = "DESC",
  topic,
  author,
  limit = 10,
  p = 1
) => {
  const allowedSortCols = ["created_at", "comment_count", "votes"];
  const allowedOrder = ["ASC", "DESC"];
  const argumentsArr = [];

  const articlesDataToSelect =
    "articles.article_id, articles.title, articles.body, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url";

  if (
    !allowedSortCols.includes(sort_by) ||
    !allowedOrder.includes(order.toUpperCase()) ||
    !Number(limit) ||
    !Number(p)
  ) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
    });
  }

  let queryString = ` SELECT ${articlesDataToSelect}, CAST(COUNT(comments.article_id) AS INTEGER) AS comment_count FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id`;

  if (topic !== undefined && author !== undefined) {
    queryString += ` WHERE articles.topic = $1 AND articles.author = $2`;
    argumentsArr.push(topic);
    argumentsArr.push(author);
  } else if (topic !== undefined) {
    queryString += ` WHERE articles.topic = $1`;
    argumentsArr.push(topic);
  } else if (author !== undefined) {
    queryString += ` WHERE articles.author = $1`;
    argumentsArr.push(author);
  }

  queryString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order} LIMIT ${limit} OFFSET ${
    limit * (p - 1)
  }`;

  return db.query(queryString, argumentsArr).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Not found" });
    } else {
      return rows;
    }
  });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
};

exports.patchArticle = (article_id, inc_votes) => {
  const votesQuery = "SELECT votes FROM articles WHERE article_id = $2";
  const updQueryString = `UPDATE articles SET votes = ($1 + (SELECT votes FROM articles WHERE article_id = $2)) WHERE article_id = $2 RETURNING *`;
  return db.query(updQueryString, [inc_votes, article_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }

    return rows[0];
  });
};

exports.newArticle = ({
  author,
  title,
  body,
  topic,
  article_img_url = "https://shorturl.at/bGYRB",
}) => {
  if (!author || !title || !body || !topic) {
    return Promise.reject({ status: 400, msg: "Not enough data" });
  } else if (typeof topic !== "string" || typeof author !== "string") {
    return Promise.reject({ status: 400, msg: "Bad Request: wrong data" });
  }

  return db
    .query(`SELECT * FROM users WHERE username = $1`, [author])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 400,
          msg: "Bad Request: author doesn't exist",
        });
      } else {
        const postQueryString = format(
          `INSERT INTO articles (author, title, body, topic, article_img_url) VALUES (%L) RETURNING *`,
          [author, title, body, topic, article_img_url]
        );

        return db.query(postQueryString).then(({ rows }) => {
          return rows[0];
        });
      }
    });
};

exports.removeArticle = (article_id) => {
  const queryString = `DELETE FROM articles WHERE article_id = $1 RETURNING *`;

  return db.query(queryString, [article_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }

    return rows[0];
  });
};
