module.exports = (socket, io, onlineUsers) => {
  socket.on("setOnline", (data) => {
    console.log(data);
    const friendSocket = onlineUsers.get(data.user2._id);
    if (friendSocket !== undefined) {
      const mySocket = onlineUsers.get(data.user1._id);
      io.to(mySocket).emit("setOnlineFriend", {
        _id: data.user2._id,
        username: data.user2.username,
        image: data.user2?.image,
        online: true,
      });
      io.to(friendSocket).emit("setOnlineFriend", {
        _id: data.user1._id,
        username: data.user1.username,
        image: data.user1?.image,
        online: true,
      });
      io.to(friendSocket).emit("reloadRecentChats", null);
    }
  });
};
