const socket = require("socket.io");
const crypto = require("crypto");
const { get } = require("mongoose");

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
   socket.on("sendMessage", ({ firstName, userId, targetUser, text }) => {
  const roomId = getSecretRoomId(userId, targetUser); // ✅ FIXED
  console.log(firstName + " sent: " + text);
  io.to(roomId).emit("messageReceived", { firstName, text });
});

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
