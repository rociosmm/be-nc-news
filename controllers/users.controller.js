const { fetchUsers } = require("../models/users.model");

exports.getAllUsers = (req, res, next) => {
  fetchUsers().then((rows) => {
    res.status(200).send({ users: rows });
  });
};
