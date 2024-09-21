import { config } from "dotenv";
import Express from "express";
import cors from "cors";
import {
  getNewestStories,
  searchStories,
} from "./controllers/newsController.js";

config({});

const PORT = process.env.PORT || 5000;

const app = Express();
app.use(cors({ origin: "*" }));

app.get("/newest-stories", getNewestStories);

app.get("/search", searchStories);

app.listen(PORT || 5000, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;