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
  })