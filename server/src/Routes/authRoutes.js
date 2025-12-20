const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const githubHeaders = require("./headers");

const createFolder = async (folderName) => {
  try {
    const pathInRepos = `${folderName}/.gitkeep`;

    await axios.put(
      `https://api.github.com/repos/${process.env.GITHUB_USER}/${
        process.env.GITHUB_REPO
      }/contents/${encodeURIComponent(pathInRepos)}`,
      {
        message: `Create folder ${folderName}`,
        content: Buffer.from("").toString("base64"),
        branch: "main",
      },
      {
        headers: githubHeaders,
      }
    );
    return true;
  } catch (err) {
    return false;
  }
};

router.post("/signup", async (req, res) => {
  console.log("SignUp", req.body);
  const { username, password1, password2 } = req.body;
  if (!username || !password1 || !password2) {
    console.log("Missing Required Fields");
    return res.json({ status: false, message: "Missing Required Fields" });
  }
  if (password1 !== password2) {
    console.log("Password Doesn't Match");
    return res.json({ status: false, message: "Password doesn't match" });
  }
  try {
    const isExists = await User.findOne({ username: username });
    if (isExists) {
      console.log("Username Already esixts");
      return res.json({ status: false, message: "Username already exists" });
    }
    const password = await bcrypt.hash(password1, 10);
    const newUser = new User({
      username: username,
      password: password,
    });
    await newUser.save();
    console.log("User Created");
    const created = await createFolder(username);
    if (!created)
      return res.json({ status: false, message: "Folder doesn't created" });
    return res.json({ status: true, message: "Successfully created" });
  } catch (err) {
    console.log(err, "Error in SignUp");
    return res.json({ status: false, message: "Error in Creating user" });
  }
});

router.post("/login", async (req, res) => {
  console.log("Login", req.body);
  const { username, password } = req.body;
  if (!username || !password) {
    return res.json({ status: false, message: "Missing required fields" });
  }
  const user = await User.findOne({ username: username });
  if (!user) {
    console.log("User Not Found");
    return res.json({ status: false, message: "Username Doesn't exists" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log("Password Doesn't Match");
    return res.json({ status: false, message: "Password Doesn't match" });
  }
  try {
    const token = jwt.sign({ username: username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    let files;
    try {
      files = await getUserFiles(username);
      console.log("Retrived files");
    } catch (err) {
      files = [];
      console.log("Error in Retriving files");
    }
    console.log("Logged in Successfully");
    return res.json({
      status: true,
      message: "Successfully logged in",
      token: token,
      username: username,
      files: files,
    });
  } catch (err) {
    console.log("Error", err);
    return res.send({ status: false, message: "Server Error" });
  }
});

module.exports = router;
