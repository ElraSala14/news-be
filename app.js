const  { getTopics } = require("./controllers/controllers");
const express = require("express");
const app = express();
const { handleInvalidPath, handleCustomErr, unhandledErr } = require("./handlers_errors/errors");
app.use(express.json());
app.get("/api/topics", getTopics);

app.use('*', handleInvalidPath);
app.use(handleCustomErr);
app.use(unhandledErr);
module.exports = app;