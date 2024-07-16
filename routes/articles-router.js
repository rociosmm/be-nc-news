const {
  getArticles,
  getArticle,
  editArticle,
} = require("../controllers/articles.controller");
const {
  getCommentsForArticle,
  postNewCommentForArticle,
} = require("../controllers/comments.controller");

const articlesRouter = require("express").Router();

articlesRouter.get("/", getArticles);
articlesRouter.route("/:article_id").get(getArticle).patch(editArticle);
articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsForArticle)
  .post(postNewCommentForArticle);

module.exports = articlesRouter;
