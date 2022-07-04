const  { getTopics } = require("./controllers");
const express = require("express");
const app = express();


app.use(express.json());
app.get("/api/topics", getTopics);

app.use((err, req, res, next) =>{
    res.status(err.status).send({ msg: err.msg});
    next(err);
});

app.use((err, req, res, next) =>{
    res.status(500).send({ msg: 'internal server error'});
})
module.exports = app;