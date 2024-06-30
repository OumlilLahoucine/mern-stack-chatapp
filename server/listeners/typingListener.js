module.exports = (socket, io, onlineUsers) => {
  socket.on("typing", (data) => {
    const socketId = onlineUsers.get(data.to);
    if (socketId !== undefined) {
      io.to(socketId).emit("isTyping", {
        from: data.from,
        isTyping: data.typing,
      });
    }
  });
};
