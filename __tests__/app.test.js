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
          expect(msg).toBe("The article not found");
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