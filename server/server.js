import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import apiRouter from "./routes/api.js";
import { limiter } from "./config/rateLimiter.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
// TODO: remove comment after complete the project
// app.use(limiter);
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use("/api", apiRouter);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "mara kha" });
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
