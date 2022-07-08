const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const testData = require('../db/data/test-data')
const seed = require('../db/seeds/seed')
beforeEach(() =>{
return seed(testData)
})
afterAll(() => {
  return connection.end();
});

describe("Invalid path errors", () => {
  test("GET404: respond with message This path is invalid path", () => {
    return request(app)
      .get("/api/topicz")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("This path is invalid");
      });
  });
});
  describe("GET api/topics", () => {
    test("GET 200: Responds with an array of topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.result)).toBe(true);
          expect(body.result).toHaveLength(3);
          body.result.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
  });
//
  describe("GET api/articles/:article_id", () => {
    test("GET 400: respond with error when article_id is not a number", () => {
      return request(app)
        .get("/api/articles/seven")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("The article_id has to be a number");
        });
    });


    test("GET 404: respond with error if the article is not found with the passed article_id", () => {
      return request(app)
        .get("/api/articles/11111111")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("The article is not found");
        });
    });

      test("GET 200: responds with an article object of given id", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.article).toBeInstanceOf(Object);
            expect(body.article.article_id).toEqual(1);
            expect(body.article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
        });
  });
  
  describe('PATCH /api/articles/:article_id', () => {
    test('GET 200: responds with the articles that have been updated', () => {
      const articleId = 1;
      const articleUpdate = {inc_votes: -1};
      return request(app)
            .patch(`/api/articles/${articleId}`)
            .send(articleUpdate)
            .expect(200)
            .then(({ body }) => {
              expect(body.article.article_id).toEqual(1);
              expect(body.article.votes).toEqual(99);                          
            });
    });
    test('GET 400: respond with error when article_id is not a number', () => {
      const articleUpdate = {inc_votes: -1};
      return request(app)
            .patch("/api/articles/number")
            .send(articleUpdate)
            .expect(400)
            .then(({ body: {msg} }) => {
              expect(msg).toBe('The article_id has to be a number');
            });
  });
  test('GET 404: respond with error if the article is not found with passed article_id', () => {
    const articleUpdate = {inc_votes: -1};
    return request(app)
          .patch("/api/articles/1111111")
          .send(articleUpdate)
          .expect(404)
          .then(({ body: {msg} }) => {
            expect(msg).toBe('The article is not found');
          });
  });
  test("GET 400: respond with error when inc_votes passed a string ", () => {
    const articleUpdate = { inc_votes: "potato" };
    return request(app)
      .patch("/api/articles/1")
      .send(articleUpdate)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("Bad Request");
      });
  });


  test('GET 400: respond with error inc_votes missed when passed an empty object', () => {
    const articleUpdate = {};
    return request(app)
    .patch("/api/articles/1")
    .send(articleUpdate)
    .expect(400)
    .then(({ body: { msg } }) => {
        expect(msg).toBe('inc_votes has been missed')
    });
  });
});

  // get users
    
    describe("GET api/users", () => {
      test("GET 200: Responds with an array of users objects", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.users)).toBe(true);
            expect(body.users).toHaveLength(4);
            body.users.forEach((user) => {
              expect(user).toEqual(
                expect.objectContaining({
                  username: expect.any(String),
                  name: expect.any(String),
                  avatar_url: expect.any(String),
                })
              );
            });
          });
      });
      test("GET404: respond with message This path is invalid path", () => {
        return request(app)
          .get("/api/no-endpoint")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("This path is invalid");
          });
      });
    });  

// get articles with comment count

describe("GET /api/articles", () => {
  test("GET 200: responds with objects articles and add comment cout", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body }) => {
      expect(Array.isArray(body.articles)).toBe(true);
        body.articles.forEach((article) =>{
          expect(article).toEqual(
          expect.objectContaining({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
        })
          )
      })
    });
  })
  test('GET 200  returnes articles sorted by date in descending order', () => {

    const articleInOrderByDate = ['2020-11-03T09:12:00.000Z',
                                  '2020-10-18T01:00:00.000Z',
                                  '2020-10-16T05:03:00.000Z',
                                  '2020-10-11T11:24:00.000Z',
                                  '2020-08-03T13:14:00.000Z',
                                  '2020-07-09T20:11:00.000Z',
                                  '2020-06-06T09:10:00.000Z',
                                  '2020-05-14T04:15:00.000Z',
                                  '2020-05-06T01:14:00.000Z',
                                  '2020-04-17T01:08:00.000Z',
                                  '2020-01-15T22:21:00.000Z',
                                  '2020-01-07T14:08:00.000Z'];
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(({ body }) => {
      body.articles.forEach((article, n) => {
        const {created_at} = article;
          expect(created_at).toEqual(articleInOrderByDate[n]);
      });
    });
  });
})


describe("GET  /api/articles/article_id/comments", () => {
  test('GET 400: respond with error when article_id is not a number', () => {
    return request(app)
          .get("/api/articles/apple/comments")
          .expect(400)
          .then(({ body: {msg} }) => {
            expect(msg).toBe('The article_id has to be a number');
          });
});
  test("GET 200: respons with comment objects inside an array", () => {
      return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({body}) => {
      expect(body.comments).toHaveLength(11)
      expect(Array.isArray(body.comments)).toBe(true);
      body.comments.forEach((comment)=> {
       expect(comment).toEqual(
       expect.objectContaining({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: 1
       })
       )
      })
      })
  })
  
  test("GET 200: resones with an empty array when passed an valid article but has no comments in the database", () => {

    return request(app)
    .get("/api/articles/4/comments")
    .expect(200)
    .then(({body}) => {
    expect(body.comments).toEqual([])

    })
})
test("GET 404: respond with error if the article is not found with the passed article_id", () => {
  return request(app)
    .get("/api/articles/999/comments")
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("The article is not found");
    });
});
});

describe("POST /api/articles/:article_id/comments", () => {
  test("POST 201: responds with added comment to database if the user does exist", () => {
    const addedComment = {username: "butter_bridge", body: "A comment has been add for the purpose of testing",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(addedComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comments).toEqual({
          article_id: 1,
          author: "butter_bridge",
          body: "A comment has been add for the purpose of testing",
          comment_id: 19,
          created_at: expect.any(String),
          votes: 0,
        });
        });
      });

      test('GET 400: respond with error when article_id is not a number', () => {
        return request(app)
              .get("/api/articles/apple/comments")
              .expect(400)
              .then(({ body: {msg} }) => {
                expect(msg).toBe('The article_id has to be a number');
              });
      });
      
      test("GET 404: respond with error if the article is not found with the passed article_id", () => {
        return request(app)
          .get("/api/articles/999/comments")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("The article is not found");
          });
      });
      
      test("GET 400: respond with error when passed body or username are invalid datatype", () => {
        const addedComment = { username: 765766, body: 1 };
        return request(app)
          .post("/api/articles/1/comments")
          .send(addedComment)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
      test("GET 400: respond with error if the body does not nexists in the post body", () => {
        const addedComment = {username: "butter_bridge",};
        return request(app)
          .post("/api/articles/1/comments")
          .send(addedComment)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
      test("GET 400: respond with error if the username does not nexists in the post body", () => {
        const addedComment = { body: "A comment has been add for the purpose of testing",};
        return request(app)
          .post("/api/articles/1/comments")
          .send(addedComment)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });

      test("GET 404: respond with error if the username is not found with the passed username", () => {
        const addedComment = { username: "john_stonehous", body: "as_a_test",};
        return request(app)
          .post("/api/articles/1/comments")
          .send(addedComment)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("The username is not found");
          });
      });
  });

  describe("DELETE /api/comments/:comment_id", () => {
    test("GET 204: deletes comment with passed the comment_id then returns no content", () => {
      return request(app)
        .delete("/api/comments/6")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });
    test("GET 404: responds with error when the passed comment_id does not exist", () => {
      return request(app)
        .delete("/api/comments/9999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("The Comment is not found");
        });
    });
  });