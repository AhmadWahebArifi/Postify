const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json("No token provided");

  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) return res.status(401).json("Invalid token format");

  try {
    // Handle mock tokens for demo mode
    if (token.startsWith('mock-token-')) {
      req.userId = 'mock-user-id';
      return next();
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error('JWT Error:', err.message);
    return res.status(401).json("Token invalid or expired");
  }
};
