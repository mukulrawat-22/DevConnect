const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { Chat } = require("../models/chat");

const chatrouter = express.Router();

chatrouter.get("/chat/:targetUser", userAuth, async (req, res) => {

    const {targetUser} = req.params;
    const userId = req.user._id;

  try {
    let chat = await Chat.findOne({
        participants: {$all: [userId, targetUser]}
    }).populate({
        path: "messages.senderId",
        select: " firstName lastName"
    })
    if(!chat){
        chat = new Chat({
            participants: [userId, targetUser],
            messages:[],
        })
        await chat.save();
    }
    res.json(chat);
  } catch (err) {
    console.error("Error in chat route:", err);
  }
});

module.exports = chatrouter;