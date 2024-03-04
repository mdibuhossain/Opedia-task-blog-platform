import vine, { errors } from "@vinejs/vine";
import prisma from "../DB/db.config.js";
import { Utils } from "../utilities/utils.js";
import { postSchema } from "../validations/authValidation.js";
import { CustomErrorReporter } from "../validations/CustomErrorReporter.js";
import uploadImage from "../utilities/uploadImage.js";

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
        let payload = await validator.validate(req.body);
        const image = req.files.image;
        const imgURL = await uploadImage(image.path);
        payload.bannerImg = imgURL;
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
          comments: {
            include: {
              author: {
                select: {
                  name: true,
                },
              },
            },
          },
          author: {
            select: {
              email: true,
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
      let { page, limit } = req.query;
      page = Number(page);
      limit = Number(limit);
      const totalPages = Math.ceil((await prisma.post.count()) / limit);
      const findPosts = await prisma.post.findMany({
        take: limit,
        skip: (page - 1) * limit,
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
        orderBy: {
          id: "desc",
        },
      });
      return res.status(200).json({ posts: findPosts, totalPages });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
