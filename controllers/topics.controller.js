const { fetchTopics } = require("../models/topics.model");

exports.getAllTopics = (req, res, next) => {
  fetchTopics()
    .then((rows) => {
      if (rows.length !== 0) {
        res.status(200).send({ topics: rows });
      }
    })
    .catch((err) => {
      next(err);
    });
};
