import uploadImage from "../utilities/uploadImage.js";

export class FileController {
  static async uploadFile(req, res) {
    try {
      const image = req.files.image;
      const imgURL = await uploadImage(image.path);
      res.status(200).json({ url: imgURL });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
}
