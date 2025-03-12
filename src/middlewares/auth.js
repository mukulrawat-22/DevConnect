
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async(req, res, next) =>{
  //read the token from the req cookies
try{
  
  const {token} = req.cookies;
  if(!token){
    throw new Error("Token not valid!!!!!");
  }

  const decodedObj = await jwt.verify(token, "DEV@TINDER$134");

  const {_id} = decodedObj;
  const user = await User.findById(_id);
  if(!user){
    throw new Error("user not found");
  } else {
    req.user = user;
    next();
  }

  //validate the token
  //find the user
} catch (err) {
  res.status(400).send("ERROR: " + err.message);
}
}


  module.exports = {
     userAuth
  };