const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionsRequest");
const { connect } = require("mongoose");
const userRouter = express.Router();

const User = require("../models/user");
//refactoring the code to make it cleaner
const SAFE_USER_DATA = "firstName lastName photoUrl gender age about skills";
//get all the pending connection requests for the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", SAFE_USER_DATA);

    res.json({
      message: "Connection requests fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("Error fetching connection requests: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionsRequest = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", SAFE_USER_DATA)
      .populate("toUserId", SAFE_USER_DATA);

    const data = connectionsRequest.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });

    res.json({
      message: "Connections fetched successfully",
      data,
    });
  } catch (err) {
    res.status(400).send("Error fetching connections: " + err.message);
  }
});

//feed api to get a random user except the logged in user
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50: limit; // max limit 50
    const skip = (page - 1) * limit;

    const connectionsRequest = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();
    connectionsRequest.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId._id.toString());
      hideUserFromFeed.add(req.toUserId._id.toString());
    });


    const user = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(SAFE_USER_DATA).limit(limit).skip(skip);

    res.send({
      message: "Feed fetched successfully",
      data: user,
    })
  } catch (err) {
    res.status(400).send("Error fetching feed: " + err.message);
  }
});
module.exports = userRouter;
