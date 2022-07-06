\c nc_news

SELECT * FROM articles;
SELECT * FROM topics;
SELECT * FROM users;
SELECT articles.*, CAST(COUNT(comments.comment_id) AS int) AS comment_count FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;