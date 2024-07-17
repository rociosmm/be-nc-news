const { fetchTopics, addTopic } = require("../models/topics.model");

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

exports.postTopic = (req, res, next) => {
  const topic = req.body;
  addTopic(topic).then((topic) => {
    res.status(201).send({topic})
  }).catch(err => {
    next(err)
  });
};
