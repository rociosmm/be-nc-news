const { fetchUsers, fetchUser } = require("../models/users.model");

exports.getAllUsers = (req, res, next) => {
  fetchUsers().then((rows) => {
    res.status(200).send({ users: rows });
  });
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUser(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};
