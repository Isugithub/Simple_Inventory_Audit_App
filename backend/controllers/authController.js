const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const normalizeRole = (role = "viewer") =>
  role.trim().toLowerCase().replace(/[\s-]+/g, "_");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const passwordPattern = /^[A-Za-z0-9]+$/;

const login = async (req, res) => {
  const { email = "", password = "" } = req.body;
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(503).json({
      success: false,
      message: "Authentication is not configured on the server.",
    });
  }

  if (!emailPattern.test(email.trim()) || password.length < 8 || !passwordPattern.test(password)) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid email and an alphanumeric password of at least 8 characters.",
    });
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  const token = jwt.sign(
    { email: user.email, role: user.role },
    secret,
    { expiresIn: "8h" },
  );

  res.json({
    success: true,
    data: { token, user: { name: user.name, email: user.email, role: user.role } },
  });
};

const signup = async (req, res) => {
  const { name = "", email = "", password = "" } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(503).json({
      success: false,
      message: "Authentication is not configured on the server. Add JWT_SECRET to backend/.env and restart the server.",
    });
  }

  if (
    !name.trim() ||
    !emailPattern.test(normalizedEmail) ||
    password.length < 8 ||
    !passwordPattern.test(password)
  ) {
    return res.status(400).json({
      success: false,
      message: "Name, a valid email, and an alphanumeric password of at least 8 characters are required.",
    });
  }

  const existingUser = await User.exists({});
  if (existingUser) {
    return res.status(403).json({
      success: false,
      message: "The first admin has already been created. Please sign in.",
    });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: "admin",
  });

  res.status(201).json({
    success: true,
    message: "Admin account created. You can now sign in.",
    data: { email: user.email },
  });
};

module.exports = { login, signup };
