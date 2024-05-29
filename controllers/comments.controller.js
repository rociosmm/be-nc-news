const { checkArticleExists } = require("../models/articles.model");
const { fetchComments, postComment } = require("../models/comments.model");

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

  const promisesArr = [
    postComment(article_id, comment),
    checkArticleExists(article_id),
  ];

  Promise.all(promisesArr)
    .then((resolvedPromises) => {
      console.log("resolvedPromises :>> ", resolvedPromises);
      const commentAdded = resolvedPromises[0];
      res.status(201).send({ comment: commentAdded });
    })
    .catch(next);
};
