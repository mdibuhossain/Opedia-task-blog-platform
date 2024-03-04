import prisma from "../DB/db.config.js";
import vine, { errors } from "@vinejs/vine";
import { CustomErrorReporter } from "../validations/CustomErrorReporter.js";
import { postSchema } from "../validations/authValidation.js";
import uploadImage from "../utilities/uploadImage.js";

vine.errorReporter = () => new CustomErrorReporter();

export class DashboardController {
  static async getUserPosts(req, res) {
    try {
      const { userId } = req.params;
      const { id } = req.user;
      if (userId.toString() !== id.toString()) {
        return res.status(401).json({ message: "Unauthorized" });
      } else {
        const findUser = await prisma.user.findUnique({
          where: {
            id: Number(userId),
          },
        });
        if (!findUser) {
          return res.status(401).json({ message: "Unauthorized" });
        } else {
          const findPosts = await prisma.post.findMany({
            orderBy: {
              id: "desc",
            },
            where: {
              authorId: Number(userId),
            },
          });
          return res.status(200).json({ posts: findPosts });
        }
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  static async editUserPost(req, res) {
    try {
      const { postId, userId } = req.params;
      const { id } = req.user;
      const body = req.body;
      if (userId.toString() !== id.toString()) {
        return res.status(401).json({ message: "Unauthorized" });
      } else {
        const findUser = await prisma.user.findUnique({
          where: {
            id: Number(userId),
          },
        });
        if (!findUser) {
          return res.status(401).json({ message: "Unauthorized" });
        } else {
          const validator = vine.compile(postSchema);
          let payload = await validator.validate(body);
          if (body?.image) {
            const image = body.image;
            const imgURL = await uploadImage(image.path);
            payload.bannerImg = imgURL;
          }
          const newPost = await prisma.post.update({
            where: {
              id: Number(postId),
              authorId: Number(userId),
            },
            data: {
              ...payload,
            },
          });
          if (newPost) {
            return res.status(201).json(newPost);
          } else {
            return res.status(404).json({ message: "Post not found." });
          }
        }
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  static async deleteUserPost(req, res) {
    try {
      const { userId, postId } = req.params;
      const { id } = req.user;
      if (userId.toString() !== id.toString()) {
        return res.status(401).json({ message: "Unauthorized" });
      } else {
        const findUser = await prisma.user.findUnique({
          where: {
            id: Number(userId),
          },
        });
        if (!findUser) {
          return res.status(401).json({ message: "Unauthorized" });
        } else {
          const deletedPost = await prisma.post.delete({
            where: {
              authorId: Number(userId),
              id: Number(postId),
            },
          });
          if (deletedPost)
            return res.status(200).json({ message: "Successfully deleted." });
          else return res.status(404).json({ message: "Post not found." });
        }
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
