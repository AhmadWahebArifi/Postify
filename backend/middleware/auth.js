const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json("No token");

  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) return res.status(401).json("Invalid token");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json("Token invalid");
  }
};
