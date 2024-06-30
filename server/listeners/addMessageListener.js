const Message = require("../models/messageModel");

module.exports = (socket, io, onlineUsers) => {
  socket.on("addMessage", async (data) => {
    const mySocketId = onlineUsers.get(data.from);
    const socketId = onlineUsers.get(data.to);

    if (mySocketId !== undefined && socketId === undefined) {
      // Send Message to Discussion UI (My UI)
      io.to(mySocketId).emit("getMyMessage", data);
      // Send Message to Recent Chats UI (My UI)
      io.to(mySocketId).emit("updateRecentChats", data);
    } else if (mySocketId !== undefined && socketId !== undefined) {
      const newData = await Message.findByIdAndUpdate(
        data._id,
        { status: "delivered" },
        { new: true, runValidators: true }
      );
      // Send Message to Discussion UI
      //   -- My UI
      io.to(mySocketId).emit("getMyMessage", newData);
      //   -- Friend UI
      io.to(socketId).emit("getMessage", newData);

      // Send Message to Recent Chats UI
      //   -- My UI
      io.to(socketId).emit("updateRecentChats", newData);
      //   -- Friend UI
      io.to(mySocketId).emit("updateRecentChats", newData);

      // Ask if the friend Read the message immediately (Still in the discussion)
      io.to(socketId).emit("YouAreReadMessage", {
        _id: newData._id,
        from: newData.from,
      });
    }
  });
};
