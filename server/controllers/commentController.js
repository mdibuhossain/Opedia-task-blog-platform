import vine, { errors } from "@vinejs/vine";
import prisma from "../DB/db.config.js";
import { Utils } from "../utilities/utils.js";
import { postSchema } from "../validations/authValidation.js";
import { CustomErrorReporter } from "../validations/CustomErrorReporter.js";

vine.errorReporter = () => new CustomErrorReporter();

export class CommentController {
  static async createComment(req, res) {
    try {
      const { email } = req.user;
      const { postId, content } = req.body;
      const findUser = await prisma.user.findUnique({
        where: { email },
      });
      if (findUser) {
        await prisma.post.update({
          where: { id: Number(postId) },
          data: {
            commentCount: {
              increment: 1,
            },
          },
        });
        const newComment = await prisma.comment.create({
          data: {
            authorId: Number(findUser.id),
            postId: Number(postId),
            content,
          },
        });
        return res.status(201).json({
          message: "Comment successfully created",
          comment: newComment,
        });
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  static async updateComment(req, res) {
    try {
      const { id: commentId } = req.params;
      const { id: userId } = req.user;
      const { content } = req.body;
      const updatedComment = await prisma.comment.update({
        where: { id: Number(commentId), authorId: Number(userId) },
        data: {
          content,
        },
      });
      return res.status(200).json({
        message: "Comment successfully updated",
        comment: updatedComment,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  static async deleteComment(req, res) {
    try {
      const { id: commentId } = req.params;
      const { postId } = req.body;
      const { id: userId } = req.user;
      const findPost = await prisma.post.findUnique({
        where: { id: Number(postId) },
      });
      const findComment = await prisma.comment.findUnique({
        where: { id: Number(commentId) },
      });
      if (findPost && findComment) {
        const result = await prisma.comment.delete({
          where: { id: Number(commentId), authorId: Number(userId) },
        });
        await prisma.post.update({
          where: { id: Number(postId) },
          data: { commentCount: { decrement: 1 } },
        });
        return res
          .status(200)
          .json({ message: "Comment successfully deleted" });
      } else {
        return res.status(404).json({ message: "Post or comment not found" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
