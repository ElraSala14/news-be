const comments = require("../db/data/test-data/comments");
const { fetchTopics, fetchArticleById, updateArticleById, fetchUsers, fetchArticles, fetchComments, addComment} = require("../models/models")


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

// =====================================================================

exports.getUsers = (req, res, next) => {
  fetchUsers().then((users) => {
   res.status(200).send({ users });
 }).catch((err) =>{
         next(err);
});
};

// ======================================================================

exports.getArticles = (req, res, next) => {
  fetchArticles()
  .then((articles) => {
      res.status(200).send({articles: articles})
  })
  .catch((err) => {
      next(err)
  })
}

//=====================================================================

exports.getComments = (req, res, next) =>{
  const articleId = req.params.article_id
  fetchComments(articleId)
  .then((comments) =>{
      res.status(200).send({comments: comments})
  })
  .catch((err) =>{
    next(err)
  });
};

//========================================================================
exports.postComment = (req, res, next) => {
  const articleId = req.params.article_id;
  const {username, body} = req.body;
  if (!username || !body){
    err = { ststus: 400, msg: "Bad Request"}
    throw err;
  }
  addComment(username, body, articleId)
    .then((comments) => {
      res.status(201).send({comments: comments});
    })
    .catch((err) => {
      next(err);
    });
};