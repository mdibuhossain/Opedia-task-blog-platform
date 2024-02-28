const express = require("express");
const dotenv = require("dotenv");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extends: false }));
dotenv.config();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  return res.status(200).json({ message: "mara kha" });
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
