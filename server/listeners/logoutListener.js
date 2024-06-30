const User = require("../models/userModel");

module.exports = (socket, io, onlineUsers) => {
  socket.on("logout", async (id) => {
    // Remove user from onlineUsers map
    onlineUsers.delete(id);

    // Update the last connection value to the current DateTime
    const user = await User.findByIdAndUpdate(
      id,
      {
        lastConnection: new Date(),
      },
      { new: true }
    );

    // get online friends
    const friendsSocket = user.friends.map((friend) => ({
      socket: onlineUsers.get(friend.toString()),
    }));
    const onlineFriends = friendsSocket.filter(
      (element) => element.socket !== undefined
    );

    // Send ('user disconnected', and the last connection value) to each online friend
    onlineFriends.map((friend) => {
      io.to(friend.socket).emit("setOnlineFriend", {
        _id: id,
        online: false,
      });
      io.to(friend.socket).emit("updateLastConnectionInRecentChats", {
        userId: id,
        lastConnection: user?.lastConnection,
      });
    });
  });
};
