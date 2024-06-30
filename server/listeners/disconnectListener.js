const User = require("../models/userModel");

module.exports = (socket, io, onlineUsers) => {
  socket.on("disconnect", async () => {
    // Find the id of disconnected User
    for (let [key, value] of onlineUsers.entries()) {
      if (value === socket.id) {
        // Remove user from onlineUsers map
        onlineUsers.delete(key);
        // Update the last connection value to the current DateTime
        const user = await User.findByIdAndUpdate(
          key,
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
            _id: key,
            online: false,
          });
          io.to(friend.socket).emit("updateLastConnectionInRecentChats", {
            userId: key,
            lastConnection: user?.lastConnection,
          });
        });

        break;
      }
    }
  });
};
