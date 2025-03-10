const express = require("express");
const connectDb = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup",async (req, res) => {

  //creating new instance of the user model
  const user = new User(req.body);
  try{
  await user.save();
  res.send("user added successfully")
  } catch(err){
    res.status(400).send("Error saving the user:" + err.messgage);
  }
})
connectDb()
  .then(() => {
    console.log("database connection established...");
    app.listen(3000 ,() => {
      console.log("Server is successfully listening port 3000");
    });
  }).catch((err) => {
    console.log("database cannot be connected");
  });