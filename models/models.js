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
      WHERE article_id = $1;`,[+article_id]
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

exports.fetchArticles = () => {
  return connection
  .query(
      `SELECT articles.*, CAST(COUNT(comments.comment_id) AS int) AS comment_count FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;`
    )
    .then((res) => {
      return res.rows;
    });
};

//================================================================================


exports.fetchComments = (articleId) => {
  if (isNaN(+articleId)) {
    return Promise.reject({ status: 400, msg: "The article_id has to be a number" });
  }
  return connection
  .query("SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id = $1", [articleId])
  .then(({rows})=> {
      if(rows.length !==0 ){
               return rows;
      }
   return connection.query(`SELECT * FROM articles WHERE article_id= $1`,[articleId])
     .then(({rowCount}) =>{
      if (rowCount === 0){
        return Promise.reject({status: 404, msg: 'The article is not found'});
      }
      return rows;
     })
    });
  };

  //=======================================================

exports.addComment = (username, body, articleId) => {
  //console.log(username, body, articleId)
  if (isNaN(+articleId)) {
    return Promise.reject({ status: 400, msg: "The article_id has to be a number" });
  }
  if (typeof username !== "string" || typeof body !== "string") {
    return Promise.reject({ status: 400, msg: "Bad Request",
    });
  }

   if (body === undefined) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
   }
   if (username === undefined) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
   }
return connection.query(`SELECT * FROM users WHERE username= $1`,[username])
.then(({rowCount}) =>{
  if (rowCount === 0){
    return Promise.reject({status: 404, msg: 'The username is not found'});
  }
}).then(() =>{
  return connection.query(`SELECT * FROM articles WHERE article_id= $1`,[articleId])
     .then(({rowCount}) =>{
          if (rowCount === 0){
            return Promise.reject({status: 404, msg: 'The article is not found'});
          }
      })
      .then(() =>{
            return connection.query(
              `INSERT INTO comments (body, article_id, author, created_at, votes)
            VALUES ($3, $1, $2, NOW(), 0) RETURNING *;`,
              [articleId, username, body]
            )
            .then(({ rows }) =>{
                 return rows[0];
            });
      });
    });
};

//===================================================================
exports.removeComment = (comment_id) => {
  return connection.query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({status: 404, msg: "The Comment is not found" });
      }
    }).then(() => {
      return connection.query(`DELETE FROM comments WHERE comments.comment_id = $1 RETURNING *;`, [comment_id]);
    });
};