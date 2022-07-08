const express = require("express");
const app = express();
const { handleInvalidPath, handleCustomErr, handlePsqlErr, unhandledErr } = require("./handlers_errors/errors");
const  { getTopics, getArticleById, patchArticleById, getUsers, getArticles, getComments, postComment, deleteComment, getApi } = require("./controllers/controllers");

app.use(express.json());


app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getComments)
app.post("/api/articles/:article_id/comments", postComment)
app.delete("/api/comments/:comment_id", deleteComment)
app.get("/api", getApi);

app.use('*', handleInvalidPath);
app.use(handleCustomErr);
app.use(handlePsqlErr);
app.use(unhandledErr);
module.exports = app;
//