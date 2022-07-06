const connection = require("../db/connection");

//=============================================================================

exports.fetchTopics = () => {
    return connection.query("SELECT * FROM topics;")
        .then((result) => {
            return result.rows;  
});
};

// ===============================================================================

exports.fetchArticleById = ({ article_id }) => {
    if (isNaN(+article_id)) {
      return Promise.reject({ status: 400, msg: "The article_id has to be a number" });
    }
    return connection.query(`SELECT * FROM articles 
      WHERE article_id = $1;`,
        [+article_id]
      )
      .then((result) => {
        if (result.rows.length) {
          return result.rows[0];
        }
        return Promise.reject({ status: 404, msg: "The article is not found" });
      })
  };

// =============================================================================

exports.updateArticleById = (articleId, articleUpdate) => {
  if(Object.keys(articleUpdate).length === 0) {
      return Promise.reject({ status: 400, msg: 'inc_votes has been missed'})
  }
  if (isNaN(+articleId)) {
    return Promise.reject({ status: 400, msg: "The article_id has to be a number" });
  }
    const { inc_votes : voteIncrement} = articleUpdate;
    return connection.query(`UPDATE articles SET votes = votes + $1 
            WHERE article_id = $2 
            RETURNING *;`, [voteIncrement, articleId])
    .then ((result) => {
        if (result.rows.length) {
          return result.rows[0];
        }
        return Promise.reject({status: 404, msg: 'The article is not found'});
    })
}

//=============================================================================

exports.fetchUsers = () => {
  return connection.query("SELECT * FROM users;")
      .then((users) => {
          return users.rows;  
});
};

// ===============================================================================
