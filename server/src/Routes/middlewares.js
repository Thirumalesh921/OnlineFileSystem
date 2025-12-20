const multer = require("multer");
const jwt = require("jsonwebtoken");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 20 },
});

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.json({ status: false, message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.username;
    next();
  } catch (err) {
    res.json({ status: false, message: "Invalid Token" });
  }
};

module.exports = { upload, authMiddleware };
