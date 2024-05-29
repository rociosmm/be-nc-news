const { checkArticleExists } = require("../models/articles.model");
const { fetchComments } = require("../models/comments.model");

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
