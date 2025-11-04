const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.replace("Bearer ", "");
    }
    if (!token && req.headers.token) {
      token = req.headers.token;
    }
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = verifyToken;
