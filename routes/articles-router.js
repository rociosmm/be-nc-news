const {
  getArticles,
  getArticle,
  editArticle,
  postArticle,
  deleteArticle,
} = require("../controllers/articles.controller");
const {
  getCommentsForArticle,
  postNewCommentForArticle,
} = require("../controllers/comments.controller");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getArticles).post(postArticle);
articlesRouter.route("/:article_id").get(getArticle).patch(editArticle).delete(deleteArticle);
articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsForArticle)
  .post(postNewCommentForArticle);

module.exports = articlesRouter;
