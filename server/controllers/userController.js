import prisma from "../DB/db.config.js";
import { Utils } from "../utilities/utils.js";

export class UserController {
  static async getUser(req, res) {
    try {
      const { email } = req.user;
      let findUser = await prisma.user.findUnique({
        where: { email },
        include: {
          posts: {
            select: {
              id: true,
              title: true,
              bannerImg: true,
            },
          },
        },
      });
      findUser = Utils.excludeFields(findUser, ["password"]);
      if (findUser) {
        return res.status(200).json(findUser);
      } else {
        return res.status(404).json({ message: "User not exist" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
}
