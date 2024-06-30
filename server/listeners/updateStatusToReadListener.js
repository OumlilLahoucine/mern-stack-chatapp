module.exports = (socket, io, onlineUsers) => {
  socket.on("updateStatusToRead", (data) => {
    const socketId = onlineUsers.get(data.selectedUserId);
    if (socketId !== undefined)
      io.to(socketId).emit("updateMessageStatusToRead", {
        friendId: data.userId,
      });
  });
};
