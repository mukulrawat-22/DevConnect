const express = require("express");
const connectDb = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    //validation of data
    validateSignUpData(req);
    //encrypt the password
    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    //creating new instance of the user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("emailId is not present in the db");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      //creat a JWT tokens
      const token = await jwt.sign({ _id: user._id }, "DEV@TINDER$134",{expiresIn: "0d"});
      //add the token to cokkies and send the response back to user
      res.cookie("token", token);

      res.send("Logged in successfully");
    } else {
      throw new Error("password is not correct");
    }
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});
app.get("/profile",userAuth , async (req, res) => {
  try {
   
    //validate my token
    const user = req.user;
   

    // console.log(cookies);
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.post("/sendConnectionRequest",userAuth, async(req, res)=>{
  const senderId = req.user;
  //sending a connection request
  res.send(senderId.firstName+ "sent the connection request!")
});
//ge user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    // console.log(userEmail);
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

//feed api - get/feed- get all the user from the databse
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("user deleted successfully");
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});
//update data of the user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const updateData = req.body;

  try {
    const ALLOWED_UPDATES = ["userId","firstName", "about", "age", "skills"];

    const isUpdateAllowed = Object.keys(updateData).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update is not allowed");
    }
    if (updateData?.skills.length > 10) {
      throw new Error("Skills should not exceed 10");
    }
    const user = await User.findByIdAndUpdate(
      { _id: userId },
      updateData,
      { returnDocument: "after" },
      { runValidators: true }
    );
    console.log(user);
    res.send("user updated successfully");
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});
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
