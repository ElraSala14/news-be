const express = require("express");
const app = express();
const { handleInvalidPath, handleCustomErr, unhandledErr } = require("./handlers_errors/errors");
const  { getTopics, getArticleById, patchArticleById } = require("./controllers/controllers");

app.use(express.json());

//
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);
//

//
app.use('*', handleInvalidPath);
app.use(handleCustomErr);
app.use(unhandledErr);
module.exports = app;
//