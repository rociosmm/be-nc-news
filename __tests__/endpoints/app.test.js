const request = require("supertest");
const app = require("../../app");
const db = require("../../db/connection");
const seed = require("../../db/seeds/seed");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../../db/data/test-data");
const endpointsData = require("../../endpoints.json");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed({ articleData, commentData, topicData, userData });
});

describe("GET /api/topics", () => {
  test("200 and return an array of the topics objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
        expect(topics.length).toBe(topicData.length);
      });
  });
});

describe("GET /api", () => {
  test("200 and return an object with all the endpoints available, with their descriptions", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        for (let endpoint in body) {
          const apiEndpoint = body[endpoint];
          expect(typeof apiEndpoint).toBe("object");
          expect(typeof endpoint).toBe("string");
          expect(typeof apiEndpoint.description).toBe("string");
          expect(apiEndpoint).toMatchObject(endpointsData[endpoint]);
          if (apiEndpoint.queries) {
            expect(Array.isArray(apiEndpoint.queries)).toBe(true);
          }
          if (apiEndpoint.exampleResponse) {
            expect(typeof apiEndpoint.exampleResponse).toBe("object");
          }
        }
        expect(Object.keys(body).length).toBe(
          Object.keys(endpointsData).length
        );
      });
  });
});
