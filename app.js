const express = require("express");
const app = express();
const port = 6565;
const { getAllTopics } = require("./controllers/topics.controller");
const { endpointsInfo } = require("./controllers/api.controller");

app.get("/api", endpointsInfo);
app.get("/api/topics", getAllTopics);

app.use((err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send(err.msg);
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Server broken" });
});


module.exports = app;
