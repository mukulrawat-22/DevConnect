const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionsRequest");
const userRouter = express.Router();

//get all the pending connection requests for the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    
    const loggedInUser = req.user;
    
    const connectionRequests = await ConnectionRequestModel.find({
        toUserId: loggedInUser._id,
        status: "interested"
    }).populate("fromUserId","firstName lastName photoUrl gender age about skills");

    res.json({
        message: "Connection requests fetched successfully",
        data: connectionRequests,
    })


  } catch (err) {
    res.status(400).send("Error fetching connection requests: " + err.message);
  }
});

module.exports = userRouter;
