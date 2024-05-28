const express = require("express");
const { getAllTopics } = require("./controllers/topics.controller");
const app = express();
const port = 6565;

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

/*app.listen(port, () => {
  console.log(`server running on ${port}`);
});*/

module.exports = app;
