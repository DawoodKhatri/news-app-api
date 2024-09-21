import request from "supertest";
import app from "../index.js";

describe("API Tests", () => {
  describe("GET /newest-stories", () => {
    it("should return a list of newest stories", async () => {
      const response = await request(app).get("/newest-stories?page=1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("meta");
      expect(response.body.meta).toHaveProperty("page");
      expect(response.body.meta).toHaveProperty("totalPages");
      expect(response.body.data).toHaveProperty("stories");
      expect(Array.isArray(response.body.data.stories)).toBe(true);
    });
  });

  describe("GET /search", () => {
    it("should return a list of searched stories", async () => {
      const response = await request(app).get("/search?query=test&page=1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("meta");
      expect(response.body.meta).toHaveProperty("page");
      expect(response.body.meta).toHaveProperty("totalPages");
      expect(response.body.data).toHaveProperty("stories");
      expect(Array.isArray(response.body.data.stories)).toBe(true);
    });

    it("should return an empty array when no results are found", async () => {
      const response = await request(app).get("/search?page=1");

      expect(response.status).toBe(200);
      expect(response.body.data.stories).toEqual([]);
    });
  });
});
