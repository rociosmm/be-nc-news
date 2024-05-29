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

describe("GET /api/articles/:article_id", () => {
  test("status 200, return the object article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;

        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      })
      .catch((err) => {
        req.status(err.status).send({ msg: err.msg });
      });
  });

  test("status 400, returns Bad Request when the article_id passed it is a different data type", () => {
    return request(app)
      .get("/api/articles/cat")
      .expect(400)
      .then(({ error }) => {
        expect(JSON.parse(error.text).msg).toBe("Bad Request");
      });
  });

  test("status 404, returns Not found when the id does not exit", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ error }) => {
        expect(JSON.parse(error.text).msg).toBe("Not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("200 and returns an array of objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
        expect(articles.length).toBe(articleData.length);
      });
  });
});
