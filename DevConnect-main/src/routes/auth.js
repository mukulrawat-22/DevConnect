const express = require("express");

const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
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
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("emailId is not present in the db");
    }
    const isPasswordValid = await user.validatePassword(password)
    if (isPasswordValid) {
      //creat a JWT tokens
      const token = await user.getJWT();
      //add the token to cokkies and send the response back to user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 6000),
      });

      res.send("Logged in successfully");
    } else {
      throw new Error("password is not correct");
    }
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) =>{
  res.cookie("token", null , {
    expires: new Date(Date.now()),
  });
  res.send("Logged out successfully");
})

module.exports = authRouter;
