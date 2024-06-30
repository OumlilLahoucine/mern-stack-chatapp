const Message = require("../models/messageModel");

module.exports = (socket, io, onlineUsers) => {
  socket.on("yesIReadMessage", async (data) => {
    await Message.findByIdAndUpdate(
      data._id,
      { status: "read" },
      { new: true, runValidators: true }
    );
    const mySocket = onlineUsers.get(data.user);
    if (mySocket !== undefined)
      io.to(mySocket).emit("updateMessageStatusToRead", {
        friendId: data.friend,
      });
  });
};
