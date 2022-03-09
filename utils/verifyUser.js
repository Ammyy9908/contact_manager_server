const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

function verifyUser(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      message: "Authentication failed",
      error: true,
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.APP_SECERT);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Authentication failed",
      error: err,
    });
  }
}

module.exports = verifyUser;
