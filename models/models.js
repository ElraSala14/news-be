const connection = require("../db/connection");


exports.fetchTopics = () => {
    return connection.query("SELECT * FROM topics;")
        .then((result) => {
            return result.rows;  
});
};


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
        return Promise.reject({ status: 404, msg: "The article not found" });
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  };
