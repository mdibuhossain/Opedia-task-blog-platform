import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import apiRouter from "./routes/api.js";
import { limiter } from "./config/rateLimiter.js";
import cookieParser from "cookie-parser";
import formData from "express-form-data";
import { Server } from "socket.io";
import { createServer } from "http";
import { CommentController } from "./controllers/commentController.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());
app.use(formData.parse());
app.use(formData.format());
app.use(formData.stream());
app.use(formData.union());
// TODO: remove comment after complete the project
app.use(limiter);
dotenv.config();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;

app.use("/api", apiRouter);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Opedia practical task" });
});

io.on("connection", (socket) => {
  console.log("connected id: ", socket.id);

  socket.on("post_comment", (data) => {
    console.log(data);
    socket.broadcast.emit("receive_comment", JSON.parse(data));
  });

  socket.on("disconnect", function () {
    console.log("A user disconnected");
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
