const express = require("express");
const app = express();
const port = 6565;
const { getAllTopics } = require("./controllers/topics.controller");
const { endpointsInfo } = require("./controllers/api.controller");
const {
  getArticle,
  getArticles,
  editArticle,
} = require("./controllers/articles.controller");
const {
  getCommentsForArticle,
  postNewCommentForArticle,
  deleteComment,
} = require("./controllers/comments.controller");

app.use(express.json());

app.get("/api", endpointsInfo);
app.get("/api/topics", getAllTopics);
app.get("/api/articles/:article_id", getArticle);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsForArticle);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Not found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Server broken" });
});

module.exports = app;
