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
const Test = require("supertest/lib/test");

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
        const { endpoints } = body;
        for (let endpoint in endpoints) {
          const apiEndpoint = endpoints[endpoint];
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
        expect(Object.keys(endpoints).length).toBe(
          Object.keys(endpointsData).length
        );
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("status 200, returns the object article", () => {
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
      });
  });

  test("status 200, returns the object article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          comments_count: 11,
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
  test("200 and returns an array of article objects", () => {
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
        expect(articles.length).toBeGreaterThan(1);
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});
describe("GET /api/articles?topic=paper", () => {
  test("200 and returns an array with paper topic articles", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(1);
        expect(articles[0].topic).toBe("cats");
      });
  });

  test("404 and returns Not found when there is not articles for a determined topic", () => {
    return request(app)
      .get("/api/articles?topic=animals")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
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

  test("404, returns a message Not found", () => {
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

describe("GET /api/articles", () => {
  test("200 and array of the articles objects sorted by date DESC by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("200 and array of the articles objects sorted by date ASC", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", {
          descending: false,
        });
      });
  });
  test("200 and array of the articles objects sorted by votes ASC", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("votes", {
          descending: false,
        });
      });
  });
  test("200 and array of the articles objects sorted by votes DESC", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=desc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });
  test("200 and array of the articles objects sorted by comment_count ASC", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("comment_count", {
          descending: false,
        });
      });
  });
  test("200 and array of the articles objects sorted by comment_count DESC", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count&order=desc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("comment_count", {
          descending: true,
        });
      });
  });

  // error 400
  test("400 and returns Bad Request Msg", () => {
    return request(app)
      .get("/api/articles?sort_by=cat")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200, returns the object user", () => {
    return request(app)
      .get("/api/users/icellusedkars")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toMatchObject({
          username: "icellusedkars",
          name: "sam",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
        });
      });
  });

  test("404, returns Not Found when the username passed it is not on the database", () => {
    return request(app)
      .get(`/api/users/cat`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("PATCH /api/comments/:comment_id ", () => {
  test("201 and returns the updated comment", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 5 })
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 21,
          author: "butter_bridge",
          article_id: 9,
          created_at: "2020-04-06T12:17:00.000Z",
        });
      });
  });
  test("400, returns Bad Request when the data type of the comment_id is not a number", () => {
    return request(app)
      .patch("/api/comments/turtle")
      .send({ inc_votes: 5 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("404, returns Not found if the comment_id does not exists in comments table", () => {
    return request(app)
      .patch("/api/comments/555")
      .send({ inc_votes: 5 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("POST /api/articles", () => {
  test("201, returns the new article posted", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "NC is almost ready",
      body: "NC news is blog where you can find articles related to Northcoders",
      topic: "paper",
      article_img_url: "https://placehold.co/600x400/png",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        const { article } = body;
        expect(article.author).toBe("butter_bridge");
        expect(article.title).toBe("NC is almost ready");
      });
  });

  test("400, returns the Bad Request when there is missing fields", () => {
    const newBadArticle = {
      author: "butter_bridge",
      body: "NC news is blog where you can find articles related to Northcoders",
      topic: "paper",
      article_img_url: "https://placehold.co/600x400/png",
    };

    return request(app)
      .post("/api/articles")
      .send(newBadArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Not enough data");
      });
  });

  test("400, returns the Bad Request when data type for the post fields is incorrect", () => {
    const newBadArticle = {
      author: "butter_bridge",
      title: "Wrong data sent",
      body: "NC news is blog where you can find articles related to Northcoders",
      topic: 1,
      article_img_url: "https://placehold.co/600x400/png",
    };

    return request(app)
      .post("/api/articles")
      .send(newBadArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: wrong data");
      });
  });
});

describe("GET /api/articles?limit=5&p=2", () => {
  test("200, returns an array with 5 articles", () => {
    return request(app)
      .get("/api/articles?limit=5")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        const { total_count } = body;
        expect(articles).toHaveLength(5);
      });
  });

  test("200, returns an array with 5 articles for the second page (offset of 5)", () => {
    return request(app)
      .get("/api/articles?limit=5&p=2")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(5);
      });
  });

  test("400, returns Bad Request if the data type for the limit it is incorrect", () => {
    return request(app)
      .get("/api/articles?limit=cat")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("400, returns Bad Request if the data type for the page it is incorrect", () => {
    return request(app)
      .get("/api/articles?limit=3&p=page")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("404, returns Not found if the page is too big that there is not articles on it", () => {
    return request(app)
      .get("/api/articles?limit=3&p=200")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("POST /api/topics", () => {
  test("201, returns an object with the new topic", () => {
    const newTopic = {
      slug: "languages",
      description: "Coding languages as JS, PHP...",
    };

    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then(({ body }) => {
        const { topic } = body;
        expect(topic.slug).toBe("languages");
        expect(topic.description).toBe("Coding languages as JS, PHP...");
      });
  });

  test("400, returns the Bad Request when there is missing fields", () => {
    const newTopic = {
      slug: "languages",
    };

    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: missing data");
      });
  });
  test("400, returns the Bad Request when the new topic is already on the database", () => {
    const newTopic = {
      slug: "paper",
      description: "2.0 - what books are made of",
    };

    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: topic duplicated");
      });
  });
});

describe("DELETE /api/articles/:article_id", () => {
  test("204, and returns No Content", () => {
    return request(app).delete("/api/articles/3").expect(204);
    /* It is not need it, 204 don't send anything
      .then(({ res }) => {
        expect(res.statusMessage).toBe("No Content");
      }); */
  });

  test("400, returns Bad Request when the article_id is not a valid data type", () => {
    return request(app)
      .delete("/api/articles/cat")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("404, returns Not found when article_id is a valid type but does not exists in the comments table", () => {
    return request(app)
      .delete("/api/articles/5555")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET /api/articles?author=grumpy19", () => {
  test("200 and returns an array with the articles for the user", () => {
    return request(app)
      .get("/api/articles?author=icellusedkars")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles[0].author).toBe("icellusedkars");
      });
  });
  test("200 and returns an array with the articles for the user", () => {
    return request(app)
      .get("/api/articles?topic=mitch&author=icellusedkars")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles[0].author).toBe("icellusedkars");
        expect(articles[0].topic).toBe("mitch");
      });
  });
  test("404 and returns Not found when a user does not have articles", () => {
    return request(app)
      .get("/api/articles?author=grumpy19")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });

});
