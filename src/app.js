// server.js or index.js (your entry file)
require("dotenv").config();

const express = require("express");
const connectDb = require("./config/database");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Routers
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

// Models & Middleware
const User = require("./models/user");
const { userAuth } = require("./middlewares/auth"); // ✅ import userAuth

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// // Routes
// app.get("/feed", userAuth, async (req, res) => {
//   try {
//     const loggedInUserId = req.user._id;

//     // count all users except logged-in
//     const count = await User.countDocuments({ _id: { $ne: loggedInUserId } });
//     if (count === 0) {
//       return res.status(404).json({ message: "No other users found" });
//     }

//     // pick random user
//     const random = Math.floor(Math.random() * count);
//     const user = await User.findOne({ _id: { $ne: loggedInUserId } }).skip(random);

//     res.status(200).json({ data: user });
//   } catch (err) {
//     console.error("Error in /feed:", err);
//     res.status(400).send("Error fetching feed: " + err.message);
//   }
// });

// Other routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// Connect DB and start server
connectDb()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
      console.log("🚀 Server is successfully listening on port 3000");
    });
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
  });
