const { fetchTopics, fetchArticleById } = require("../models/models")

// 
exports.getTopics = (req, res, next) => {
   fetchTopics().then((result) => {
    res.status(200).send({ result });
  }).catch((err) =>{
          next(err);
});
};

exports.getArticleById = (req, res, next) => {
  fetchArticleById(req.params)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

