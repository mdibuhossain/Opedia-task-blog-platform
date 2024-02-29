import { Router } from "express";
import { AuthController } from "../controllers/authController.js";
import { UserController } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { PostController } from "../controllers/postController.js";
import { CommentController } from "../controllers/commentController.js";

const apiRouter = Router();

apiRouter.post("/auth/register", AuthController.register);
apiRouter.post("/auth/login", AuthController.login);

apiRouter.get("/profile", authMiddleware, UserController.getUser);

apiRouter.post("/post", authMiddleware, PostController.createPost);
apiRouter.put("/post/:id", authMiddleware, PostController.updatePost);
apiRouter.delete("/post/:id", authMiddleware, PostController.deletePost);
apiRouter.get("/post/:id", PostController.getPost);
apiRouter.get("/posts", PostController.getPosts);

apiRouter.post("/comment", authMiddleware, CommentController.createComment);
apiRouter.put("/comment/:id", authMiddleware, CommentController.updateComment);
apiRouter.delete("/comment/:id", authMiddleware, CommentController.deleteComment);

export default apiRouter;
