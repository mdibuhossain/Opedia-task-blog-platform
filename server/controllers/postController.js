import vine, { errors } from "@vinejs/vine";
import prisma from "../DB/db.config.js";
import { Utils } from "../utilities/utils.js";
import { postSchema } from "../validations/authValidation.js";
import { CustomErrorReporter } from "../validations/CustomErrorReporter.js";

vine.errorReporter = () => new CustomErrorReporter();

export class PostController {
  static async createPost(req, res) {
    try {
      const { email } = req.user;
      const findUser = await prisma.user.findUnique({
        where: { email },
      });
      if (findUser) {
        const validator = vine.compile(postSchema);
        const payload = await validator.validate(req.body);
        const newPost = await prisma.post.create({
          data: {
            ...payload,
            authorId: findUser.id,
          },
        });
        return res.status(201).json(newPost);
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  static async getPost(req, res) {
    try {
      const { id } = req.params;
      let findPost = await prisma.post.findUnique({
        where: { id: Number(id) },
        include: {
          comments: true,
          author: {
            select: {
              name: true,
              photo: true,
            },
          },
        },
      });
      if (findPost) {
        findPost = Utils.excludeFields(findPost, ["authorId"]);
        return res.status(200).json(findPost);
      } else {
        return res.status(404).json({ message: "Post not found" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  static async getPosts(req, res) {
    try {
      const findPosts = await prisma.post.findMany({
        select: {
          id: true,
          title: true,
          bannerImg: true,
          createdAt: true,
          author: {
            select: {
              name: true,
              photo: true,
            },
          },
        },
      });
      return res.status(200).json({ posts: findPosts });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  static async updatePost(req, res) {
    try {
      const { id } = req.params;
      const { id: userId } = req.user;
      const body = req.body;
      const findPost = await prisma.post.findUnique({
        where: { id: Number(id), authorId: Number(userId) },
      });
      if (findPost) {
        let updatedPost = await prisma.post.update({
          where: { id: Number(id), authorId: Number(userId) },
          include: {
            comments: true,
            author: {
              select: {
                name: true,
                photo: true,
              },
            },
          },
          data: {
            ...body,
          },
        });
        updatedPost = Utils.excludeFields(updatedPost, ["authorId"]);
        return res
          .status(200)
          .json({ message: "Post successfully updated", post: updatedPost });
      } else {
        return res.status(404).json({ message: "Post not found" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  static async deletePost(req, res) {
    try {
      const { id } = req.params;
      const { id: userId } = req.user;
      const findPost = await prisma.post.findUnique({
        where: { id: Number(id), authorId: Number(userId) },
      });
      if (findPost) {
        await prisma.post.delete({
          where: { id: Number(id) },
        });
        return res.status(200).json({ message: "Post successfully deleted" });
      } else {
        return res.status(404).json({ message: "Post not found" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
