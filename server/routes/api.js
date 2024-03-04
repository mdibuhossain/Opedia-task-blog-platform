import { Router } from "express";
import { AuthController } from "../controllers/authController.js";
import { UserController } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { PostController } from "../controllers/postController.js";
import { CommentController } from "../controllers/commentController.js";
import { FileController } from "../controllers/fileController.js";
import { DashboardController } from "../controllers/dashboardController.js";

const apiRouter = Router();
apiRouter.post("/upload/single", authMiddleware, FileController.uploadFile);

apiRouter.post("/auth/register", AuthController.register);
apiRouter.post("/auth/login", AuthController.login);
apiRouter.get("/auth/logout", AuthController.logout);

apiRouter.get("/profile", authMiddleware, UserController.getUser);

apiRouter.post("/post", authMiddleware, PostController.createPost);
apiRouter.get("/post/:id", PostController.getPost);
apiRouter.get("/posts", PostController.getPosts);

apiRouter.get("/comments/:postid", CommentController.getComments);
apiRouter.post("/comment", authMiddleware, CommentController.createComment);
apiRouter.put("/comment/:id", authMiddleware, CommentController.updateComment);
apiRouter.delete(
  "/comment/:id",
  authMiddleware,
  CommentController.deleteComment
);

apiRouter.get(
  "/dashboard/posts/user/:userId",
  authMiddleware,
  DashboardController.getUserPosts
);
apiRouter.put(
  "/dashboard/post/edit/:postId/user/:userId",
  authMiddleware,
  DashboardController.editUserPost
);
apiRouter.delete(
  "/dashboard/post/:postId/user/:userId",
  authMiddleware,
  DashboardController.deleteUserPost
);

export default apiRouter;
