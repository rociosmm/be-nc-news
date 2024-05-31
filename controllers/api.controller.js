const endpointsData = require("../endpoints.json");

exports.endpointsInfo = (req, res, next) => {
  if (endpointsData) {
    res.status(200).send({ endpoints: endpointsData });
  } else {
    res.status(404).send({ msg: "Not found" });
  }
};
