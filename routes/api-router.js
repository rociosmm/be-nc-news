const apiRouter = require("express").Router();
const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const usersRouter = require("./users-router");
const { endpointsInfo } = require("../controllers/api.controller");
const topicsRouter = require("./topics-router");

apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/topics", topicsRouter);

apiRouter.get("/", endpointsInfo);

module.exports = apiRouter;
