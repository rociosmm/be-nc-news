const { checkArticleExists } = require("../models/articles.model");
const {
  fetchComments,
  postComment,
  delCommentFromDB,
} = require("../models/comments.model");

exports.getCommentsForArticle = (req, res, next) => {
  const { article_id } = req.params;
  const promisesArr = [
    fetchComments(article_id),
    checkArticleExists(article_id),
  ];

  Promise.all(promisesArr)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postNewCommentForArticle = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;

  const promisesArr = [postComment(article_id, comment)];

  Promise.all(promisesArr)
    .then((resolvedPromises) => {
      const commentAdded = resolvedPromises[0];
      res.status(201).send({ comment: commentAdded });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  console.log("comment_id :>> ", comment_id);
  delCommentFromDB(comment_id)
    .then((deletedComment) => {
      //if (deletedComment) {
      res.status(204).send({ msg: "No Content" });
      // }
    })
    .catch((err) => {
      next(err);
    });
};
