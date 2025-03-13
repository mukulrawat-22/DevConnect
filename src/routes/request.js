
const express = require("express");

const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const senderId = req.user;
    //sending a connection request
    res.send(senderId.firstName + "sent the connection request!");
  });

module.exports = requestRouter;