import axios from "axios";

const fetchNewestStoryIds = async () => {
  console.log("API 1 Called");

  const { data: storyIds } = await axios.get(
    "https://hacker-news.firebaseio.com/v0/newstories.json"
  );
  return storyIds;
};

const fetchStoryById = async (id) => {
  console.log("API 2 Called");

  const { data: story } = await axios.get(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json`
  );
  return story;
};

const fetchSearchedStories = async ({ searchQuery, page = 0 }) => {
  console.log("Search API Called");

  const { data: stories } = await axios.get(
    `https://hn.algolia.com/api/v1/search_by_date?query=${searchQuery}&page=${page}&tags=story`
  );

  return stories;
};

export { fetchNewestStoryIds, fetchStoryById, fetchSearchedStories };
