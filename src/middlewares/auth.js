const jwt = require("jsonwebtoken");
const mongoose = require("mongoose"); // ✅ fix typo
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Authentication token missing" });
    }

    const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedObj._id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { userAuth };
