import { getNewestStories } from "./newsController.js";
import { jest } from "@jest/globals";

// Mocking Redis Service
const redisService = {
  getFromCache: jest.fn(),
  setToCache: jest.fn(),
};

// Mocking News Service
const newsService = {
  fetchNewestStoryIds: jest.fn(),
  fetchStoryById: jest.fn(),
};

// Mock Response and Request objects
const mockRes = {
  json: jest.fn(),
  status: jest.fn(() => mockRes),
};
const mockReq = {
  query: {
    page: 1,
  },
};

describe("getNewestStories", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  test("should fetch stories from cache and API, and return them in JSON format", async () => {
    // Mock the response of fetching story IDs and story data
    const mockStoryIds = [1, 2, 3];
    const mockStory = { id: 1, title: "Test Story" };

    newsService.fetchNewestStoryIds.mockResolvedValue(mockStoryIds);
    newsService.fetchStoryById.mockResolvedValue(mockStory);
    redisService.getFromCache.mockResolvedValue(null); // Simulate cache miss
    redisService.setToCache.mockResolvedValue(undefined);

    await getNewestStories(redisService, newsService, mockReq, mockRes);

    // Assertions
    expect(newsService.fetchNewestStoryIds).toHaveBeenCalled();
    expect(newsService.fetchStoryById).toHaveBeenCalledWith(1);
    expect(redisService.getFromCache).toHaveBeenCalledWith("1");
    expect(redisService.setToCache).toHaveBeenCalledWith("1", mockStory, 86400);
    expect(mockRes.json).toHaveBeenCalledWith([
      mockStory,
      mockStory,
      mockStory,
    ]);
  });

  test("should return stories from cache if available", async () => {
    const mockStoryIds = [1, 2, 3];
    const mockStory = { id: 1, title: "Test Story from Cache" };

    newsService.fetchNewestStoryIds.mockResolvedValue(mockStoryIds);
    redisService.getFromCache.mockResolvedValue(mockStory); // Simulate cache hit

    await getNewestStories(redisService, newsService, mockReq, mockRes);

    // Assertions
    expect(redisService.getFromCache).toHaveBeenCalledWith("1");
    expect(newsService.fetchStoryById).not.toHaveBeenCalled(); // No need to fetch from API
    expect(mockRes.json).toHaveBeenCalledWith([
      mockStory,
      mockStory,
      mockStory,
    ]);
  });

  test("should handle errors and return 500 status code", async () => {
    const errorMessage = "API Error";

    newsService.fetchNewestStoryIds.mockRejectedValue(new Error(errorMessage));

    await getNewestStories(redisService, newsService, mockReq, mockRes);

    // Assertions
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: errorMessage,
    });
  });
});
