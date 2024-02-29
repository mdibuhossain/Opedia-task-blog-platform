import vine, { errors } from "@vinejs/vine";
import prisma from "../DB/db.config.js";
import { registerSchema, loginSchema } from "../validations/authValidation.js";
import { CustomErrorReporter } from "../validations/CustomErrorReporter.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import jwt from "jsonwebtoken";

vine.errorReporter = () => new CustomErrorReporter();

export class AuthController {
  static async register(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(registerSchema);
      const payload = await validator.validate(body);
      // check if user already exist
      const findUser = await prisma.user.findUnique({
        where: { email: payload.email },
      });
      if (findUser) {
        return res.status(400).json({
          errors: {
            email: "Email already registered",
          },
        });
      }
      // password encrypt
      const salt = bcrypt.genSaltSync(3);
      payload.password = bcrypt.hashSync(payload.password, salt);
      const newUser = await prisma.user.create({
        data: payload,
      });
      return res
        .status(201)
        .json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ errors: error.messages });
      } else {
        return res.status(500).json({ message: "Something went wrong" });
      }
    }
  }

  static async login(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(loginSchema);
      const payload = await validator.validate(body);
      // check user
      const findUser = await prisma.user.findUnique({
        where: { email: payload.email },
      });
      if (findUser) {
        if (!bcrypt.compareSync(payload.password, findUser.password)) {
          return res.status(401).json({ message: "Incorrect Credentials" });
        }
        const payloadData = {
          id: findUser.id,
          email: findUser.email,
          role: findUser.role,
        };
        const token = jwt.sign(payloadData, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });
        return res
          .status(200)
          .json({ message: "Logged in", access_token: `Bearer ${token}` });
      }
      return res.status(404).json({ message: "Incorrect Credentials" });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ errors: error.messages });
      } else {
        return res.status(500).json({ message: "Something went wrong" });
      }
    }
  }
}
