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

  describe("/api", () => {
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