import vine from "@vinejs/vine";
import { title } from "process";

export const registerSchema = vine.object({
  name: vine.string().minLength(2).maxLength(150),
  email: vine.string().email(),
  password: vine.string().minLength(4).maxLength(16).confirmed(),
});

export const loginSchema = vine.object({
  email: vine.string().email(),
  password: vine.string(),
});

export const postSchema = vine.object({
  title: vine.string(),
  content: vine.string(),
  bannerImg: vine.string(),
});
