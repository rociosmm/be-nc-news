const db = require("../db/connection");

exports.fetchComments = (article_id) => {
  let queryString = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`;

  return db.query(queryString, [article_id]).then(({ rows }) => {
    return rows;
  });
};

exports.postComment = (article_id, comment) => {
  const arrInsert = [comment.body, comment.username, article_id];
  const queryString = `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *`;
  return db.query(queryString, arrInsert).then(({ rows }) => {
    return rows[0];
  });
};

exports.delCommentFromDB = (comment_id) => {
  const queryString = `DELETE FROM comments WHERE comment_id = $1 RETURNING *`;
  return db.query(queryString, [comment_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return rows[0];
  });
};

exports.editComment = (comment_id, inc_votes) => {
  const votesQuery = `SELECT votes FROM comments WHERE comment_id = $2`;
  const UpdQueryString = `UPDATE comments SET votes = ($1 + (${votesQuery})) WHERE comment_id = $2 RETURNING *`;
  return db.query(UpdQueryString, [inc_votes, comment_id]).then(({rows}) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Not found" });
    } else {
      return rows[0];
    }
  });
};
