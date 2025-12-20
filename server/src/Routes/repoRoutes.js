const express = require("express");
const router = express.Router();
const axios = require("axios");
const { upload, authMiddleware } = require("./middlewares");

const githubHeaders = require("./headers");

const getUserFiles = async (username) => {
  try {
    const url = `https://api.github.com/repos/${process.env.GITHUB_USER}/${
      process.env.GITHUB_REPO
    }/contents/${encodeURIComponent(username)}`;
    const res = await axios.get(url, { headers: githubHeaders });

    if (!Array.isArray(res.data)) return [];

    const files = res.data
      .filter((item) => item.type === "file" && item.name !== ".gitkeep")
      .map((item) => ({
        name: item.name,
        size: item.size,
      }));

    return files;
  } catch (err) {
    if (err.response?.status === 404) {
      return [];
    }
    console.error(
      "Error fetching user files:",
      err.response?.data || err.message
    );
    throw err;
  }
};

router.post(
  "/add_file",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    console.log("Add file");
    try {
      const username = req.user;
      if (!username) {
        console.log("Username not provided");
        return res.json({ status: false, message: "Unauthorized" });
      }

      const file = req.file;
      if (!file) {
        console.log("File not Provided");
        return res.json({
          status: false,
          message: "No file provided",
        });
      }

      const pathInRepo = `${username}/${file.originalname}`;
      const encodedPath = encodeURIComponent(pathInRepo);
      let fileExists = false;

      try {
        await axios.get(
          `https://api.github.com/repos/${process.env.GITHUB_USER}/${process.env.GITHUB_REPO}/contents/${encodedPath}`,
          { headers: githubHeaders }
        );
        fileExists = true;
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error(
            "GitHub check error:",
            err.response?.data || err.message
          );
          return res.json({ status: false, message: "Server Error" });
        }
      }

      if (fileExists) {
        return res.json({
          status: false,
          message:
            "File already exists. Please rename the file you are uploading or delete the existing file",
        });
      }
      const content = file.buffer.toString("base64");

      const githubRes = await axios.put(
        `https://api.github.com/repos/${process.env.GITHUB_USER}/${process.env.GITHUB_REPO}/contents/${encodedPath}`,
        {
          message: `Upload ${file.originalname} for user ${username}`,
          content,
          branch: "main",
        },
        {
          headers: githubHeaders,
        }
      );

      console.log("File Uploaded Successfully");

      return res.json({
        status: true,
        message: "File Uploaded Successfully",
        name: githubRes.data.content.name,
        size: githubRes.data.content.size,
      });
    } catch (err) {
      console.error("GitHub upload error:", err.response?.data || err.message);
      return res.json({
        status: false,
        message: "Error uploading file",
      });
    }
  }
);

router.get("/get_files", authMiddleware, async (req, res) => {
  console.log("Get files");
  const files = await getUserFiles(req.user);
  return res.json({ status: true, files: files });
});

router.get("/download_file", authMiddleware, async (req, res) => {
  console.log("Download file");
  try {
    const username = req.user;
    const { filename } = req.query;

    if (!filename) {
      return res.json({ status: false, message: "Filename is required" });
    }

    const pathInRepo = `${username}/${filename}`;
    const githubUrl = `https://api.github.com/repos/${
      process.env.GITHUB_USER
    }/${process.env.GITHUB_REPO}/contents/${encodeURIComponent(pathInRepo)}`;

    const fileRes = await axios.get(githubUrl, {
      headers: {
        ...githubHeaders,
        Accept: "application/vnd.github.raw",
      },
      responseType: "arraybuffer",
    });

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/octet-stream");

    return res.send(fileRes.data);
  } catch (err) {
    console.error("GitHub download error:", err.response?.data || err.message);

    if (err.response?.status === 404) {
      return res.json({ status: false, message: "File not found" });
    }

    return res.json({ status: false, message: "Error downloading file" });
  }
});

router.delete("/delete_file", authMiddleware, async (req, res) => {
  console.log("Delete files");
  try {
    const username = req.user;
    const filename = req.headers.data;

    if (!filename) {
      return res.json({ status: false, message: "Filename is required" });
    }

    const pathInRepo = `${username}/${filename}`;
    const githubUrl = `https://api.github.com/repos/${
      process.env.GITHUB_USER
    }/${process.env.GITHUB_REPO}/contents/${encodeURIComponent(pathInRepo)}`;

    let fileRes;
    try {
      fileRes = await axios.get(githubUrl, { headers: githubHeaders });
    } catch (err) {
      if (err.response?.status === 404) {
        return res.json({ status: false, message: "File not found" });
      }
      throw err;
    }

    const fileSha = fileRes.data.sha;

    const gitHubRes = await axios.delete(githubUrl, {
      headers: githubHeaders,
      data: {
        message: `Delete ${filename} for user ${username}`,
        sha: fileSha,
        branch: "main",
      },
    });
    return res.json({
      status: true,
      message: "File deleted successfully",
    });
  } catch (err) {
    console.error("GitHub delete error:", err.response?.data || err.message);
    return res
      .status(500)
      .json({ status: false, message: "Error deleting file" });
  }
});

module.exports = router;
