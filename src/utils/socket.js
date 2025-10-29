const socket = require("socket.io");
const crypto = require("crypto");
const { get } = require("mongoose");
const { Chat } = require("../models/chat");

const getSecretRoomId = (userId, targetUser) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUser].sort().join("$"))
    .digest("hex");
};
const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinChat", ({ firstName, userId, targetUser }) => {
      const roomId = getSecretRoomId(userId, targetUser);
      console.log(firstName + " joined room " + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUser, text }) => {
        

        // Save message to database
        try {
          const roomId = getSecretRoomId(userId, targetUser); // ✅ FIXED
        console.log(firstName + " sent: " + text);
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUser] },
          });

          if (!chat) {
             chat = new Chat({
              participants: [userId, targetUser],
              messages: [],
            });
          }
          //push the message to the chat's messages array
          chat.messages.push({senderId: userId, text});
          await chat.save();
          
        io.to(roomId).emit("messageReceived", { firstName, text });
        } catch (error) {
          console.error("Error saving message to database:", error);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
