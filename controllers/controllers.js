const { fetchTopics, fetchArticleById, updateArticleById } = require("../models/models")


// =====================================================================

exports.getTopics = (req, res, next) => {
   fetchTopics().then((result) => {
    res.status(200).send({ result });
  }).catch((err) =>{
          next(err);
});
};

// ======================================================================

exports.getArticleById = (req, res, next) => {
  fetchArticleById(req.params)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

// ========================================================================

exports.patchArticleById = (req, res, next) => {
  const { article_id }= req.params;
  const articleUpdate = req.body;
  updateArticleById(article_id, articleUpdate)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

// ======================================================================

