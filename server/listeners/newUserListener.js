const User = require("../models/userModel");
const Message = require("../models/messageModel");

module.exports = (socket, io, onlineUsers) => {
  socket.on("newUser", async (id) => {
    // Add user to online users map
    onlineUsers.set(id, socket.id);

    // Change all the received message status to delivered for both (the Sender and the Receiver)
    const messagesNotReceived = await Message.find({
      to: id,
      status: "sent",
    }).select("_id");
    const toBeUpdatedIds = messagesNotReceived;

    await Promise.all(
      messagesNotReceived.map((item) =>
        Message.updateOne(
          { _id: item._id },
          { $set: { status: "delivered" } },
          { new: true, runValidators: true }
        )
      )
    );

    // Return messages updated messages status (to update status in the Friend UI)
    const messages = await Message.find({ _id: { $in: toBeUpdatedIds } });
    messages.map((message) => {
      const socketId = onlineUsers.get(message.from.toString());
      if (socketId !== undefined) {
        // Update status to delivered in (recentChats and messageBox)
        io.to(socketId).emit("updateRecentChats", message);
        io.to(socketId).emit("updateMessageStatus", message);
      }
    });

    // Get all the online friends Ids (after connecting)
    const user = await User.findById(id);
    const friendsSocket = user.friends.map((friend) => ({
      id: friend,
      socket: onlineUsers.get(friend.toString()),
    }));
    const onlineFriends = friendsSocket.filter(
      (element) => element.socket !== undefined
    );

    // Get all the online friends (informations)
    const onlineFriendsInfo = await Promise.all(
      onlineFriends.map((friend) =>
        User.findById(friend.id).select("username image")
      )
    );

    // Get all the online friends (My UI)
    io.to(socket.id).emit("getOnlineFriends", onlineFriendsInfo);

    // Send 'this user is connected' foreach online friend (Friends UI)
    onlineFriends.map((friend) =>
      io.to(friend.socket).emit("setOnlineFriend", {
        _id: user._id,
        username: user.username,
        image: user.image,
        online: true,
      })
    );
  });
};
