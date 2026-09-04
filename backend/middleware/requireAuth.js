const jwt = require("jsonwebtoken");

const getToken = (req) => {
  const authorization = req.get("authorization") || "";
  return authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";
};

const requireAuth = (req, res, next) => {
  const token = getToken(req);
  const secret = process.env.JWT_SECRET;

  if (!secret || !token) {
    return res.status(401).json({
      success: false,
      message: "Please log in to continue.",
    });
  }

  try {
    req.user = jwt.verify(token, secret);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Your session has expired. Please log in again.",
    });
  }
};

module.exports = requireAuth;
