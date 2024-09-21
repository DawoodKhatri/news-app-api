import { getFromCache, setToCache } from "../services/cacheService.js";
import {
  fetchNewestStoryIds,
  fetchStoryById,
  fetchSearchedStories,
} from "../services/newsService.js";

export const getNewestStories = async (req, res) => {
  try {
    const page = (req.query.page || 1) - 1;
    const pageSize = 20;

    const storyIds = await fetchNewestStoryIds();

    const totalPages = Math.ceil(storyIds.length / pageSize);

    const storyPromises = storyIds
      .slice(page * pageSize, (page + 1) * pageSize)
      .map(async (id) => {
        let story = await getFromCache(`${id}`);

        if (!story) {
          story = await fetchStoryById(id);
          await setToCache(`${id}`, story, 86400);
        }

        return story;
      });

    const stories = await Promise.all(storyPromises);

    res.json({
      meta: {
        page: page + 1,
        totalPages,
      },
      data: {
        stories: stories
          .filter((story) => story.url)
          .map(({ title, time, url }) => ({
            title,
            time,
            url,
            icon: new URL(url).origin + "/favicon.ico",
          })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchStories = async (req, res) => {
  try {
    const page = (req.query.page || 1) - 1;
    const query = req.query.query || "";

    if (!query) {
      return res.json({
        meta: {
          page: 1,
          totalPages: 0,
        },
        data: {
          stories: [],
        },
      });
    }

    const stories = await fetchSearchedStories({
      searchQuery: query,
      page,
    });

    res.json({
      meta: {
        page: page + 1,
        totalPages: stories.nbPages,
      },
      data: {
        stories: stories.hits
          .filter((story) => story.url)
          .map(({ title, created_at_i, url }) => ({
            title,
            time: created_at_i,
            url,
            icon: new URL(url).origin + "/favicon.ico",
          })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default { getNewestStories, searchStories };
