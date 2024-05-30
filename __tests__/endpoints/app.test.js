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
        res.status(err.status).send({ msg: err.msg });
      });
  });

  test("400, returns Bad Request when the article_id passed it is a different data type", () => {
    return request(app)
      .get("/api/articles/cat")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("status 404, returns Not found when the id does not exit", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
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
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
          expect(typeof article.comment_count).toBe("number");
        });
        expect(articles.length).toBe(articleData.length);
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200 and returns the comments for a determined article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });

  test("status 400, returns Bad Request when the article_id passed it is a different data type", () => {
    return request(app)
      .get("/api/articles/dog/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("404, return a message Not found", () => {
    return request(app)
      .get("/api/articles/9999999/comments")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201, and returns the new comment", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Lorem fistrum qué dise usteer fistro de la pradera torpedo a wan nostrud al ataquerl.",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment.author).toBe("icellusedkars");
        expect(comment.body).toBe(
          "Lorem fistrum qué dise usteer fistro de la pradera torpedo a wan nostrud al ataquerl."
        );
      });
  });

  // post comment
  test("404, returns error when article_id doesn't exist in the articles table", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Lorem fistrum qué dise usteer fistro de la pradera torpedo a wan nostrud al ataquerl.",
    };
    return request(app)
      .post("/api/articles/9999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("201 and returns the updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 5 })
      .expect(201)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 105,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("400, returns Bad Request when the data type of the article_id is not a number", () => {
    return request(app)
      .patch("/api/articles/cat")
      .send({ inc_votes: 5 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("404, returns Not found if the article_id does not exists in articles table", () => {
    return request(app)
      .patch("/api/articles/555")
      .send({ inc_votes: 5 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204, and returns No Content", () => {
    return request(app).delete("/api/comments/13").expect(204);
    /* It is not need it, 204 don't send anything
      
      .then(({ res }) => {
        expect(res.statusMessage).toBe("No Content");
      }); */
  });

  test("400, returns Bad Request when the comment_id is not a valid data type", () => {
    return request(app)
      .delete("/api/comments/cat")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("404, returns Not found when comment_id is a valid type but does not exists in the comments table", () => {
    return request(app)
      .delete("/api/comments/5555")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET /api/users", () => {
  test("200 and returns an array with the user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
        expect(users.length).toBeGreaterThan(1);
      });
  });
});
