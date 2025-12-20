const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

app.use(
  cors({ origin: process.env.FRONTEND_URL, methods: ["POST", "GET", "DELETE"] })
);

app.use(express.json());

const authRoutes = require("./Routes/authRoutes");
app.use("/auth", authRoutes);

const repoRoutes = require("./Routes/repoRoutes");
app.use("/repo", repoRoutes);

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.json({
        status: false,
        message: "File size is too large. Max allowed size is 20MB.",
      });
    }
  } else if (err) {
    return res.json({ status: false, message: "Something went wrong!" });
  }
  next();
});

module.exports = app;
