// server.js or index.js (your entry file)
require("dotenv").config();

const express = require("express");
const connectDb = require("./config/database");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");

// Routers
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

// Models & Middleware
const User = require("./models/user");
const { userAuth } = require("./middlewares/auth"); // ✅ import userAuth
const initializeSocket = require("./utils/socket");


// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());


// Other routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

const server = http.createServer(app);
initializeSocket(server);

// Connect DB and start server
connectDb()
  .then(() => {
    console.log("Database connection established...");
    server.listen(process.env.PORT, () => {
      console.log(`🚀 Server is successfully listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
  });
