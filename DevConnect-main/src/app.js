const express = require("express");
const connectDb = require("./config/database");
const app = express();
const cors = require('cors');

const cookieParser = require("cookie-parser");

app.use(cors({
    origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);

connectDb()
  .then(() => {
    console.log("database connection established...");
    app.listen(3000, () => {
      console.log("Server is successfully listening port 3000");
    });
  })
  .catch((err) => {
    console.log("database cannot be connected");
  });
