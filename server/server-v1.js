const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const mongoose = require("mongoose");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const server = createServer(app);

const User = require("./models/userModel");
const Invitation = require("./models/invitationModel");
const Message = require("./models/messageModel");

// Connect to DB
mongoose
  .connect(process.env.CONNEXION_STRING)
  .then((con) => console.log("Connected"))
  .catch((err) => console.log(err.message));

// Listen
server.listen(process.env.PORT, () => {
  console.log("App running...");
});

const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});

// const onlineUsers = {};
const onlineUsers = new Map();

// Socket IO
io.on("connection", (socket) => {
  // Listening for a new user
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

    const messages = await Message.find({ _id: { $in: toBeUpdatedIds } });
    messages.map((message) => {
      const socketId = onlineUsers.get(message.from.toString());
      if (socketId !== undefined) {
        io.to(socketId).emit("updateRecentChats", message);
        io.to(socketId).emit("updateMessageStatus", message);
      }
    });

    // Get Friends
    const user = await User.findById(id);
    const friendsSocket = user.friends.map((friend) => ({
      id: friend,
      socket: onlineUsers.get(friend.toString()),
    }));
    const onlineFriends = friendsSocket.filter(
      (element) => element.socket !== undefined
    );

    // Get all the online friends after connecting
    const onlineFriendsInfo = await Promise.all(
      onlineFriends.map((friend) =>
        User.findById(friend.id).select("username image")
      )
    );

    io.to(socket.id).emit("getOnlineFriends", onlineFriendsInfo);

    // Send to friends 'this user is connected'
    onlineFriends.map((friend) =>
      io.to(friend.socket).emit("setOnlineFriend", {
        _id: user._id,
        username: user.username,
        image: user.image,
        online: true,
      })
    );
  });

  // Update Online Friends When Accept Invitation
  socket.on("setOnline", (data) => {
    const friendSocket = onlineUsers.get(data.user2.from);
    if (friendSocket !== undefined) {
      const mySocket = onlineUsers.get(data.user1._id);
      io.to(mySocket).emit("setOnlineFriend", {
        _id: data.user2.from,
        username: data.user2.username,
        image: data.user2?.image,
      });
      io.to(friendSocket).emit("setOnlineFriend", {
        _id: data.user1._id,
        username: data.user1.username,
        image: data.user1.image,
      });
      io.to(friendSocket).emit("reloadRecentChats", null);
    }
  });

  // Listening for a new message
  socket.on("addMessage", async (data) => {
    const mySocketId = onlineUsers.get(data.from);
    const socketId = onlineUsers.get(data.to);

    if (mySocketId !== undefined && socketId === undefined) {
      // Send Message to Discussion UI
      io.to(mySocketId).emit("getMyMessage", data);
      // Send Message to Recent Chats UI
      io.to(mySocketId).emit("updateRecentChats", data);
    } else if (mySocketId !== undefined && socketId !== undefined) {
      const newData = await Message.findByIdAndUpdate(
        data._id,
        { status: "delivered" },
        { new: true, runValidators: true }
      );
      // Send Message to Discussion UI
      io.to(mySocketId).emit("getMyMessage", newData);
      io.to(socketId).emit("getMessage", newData);

      // Send Message to Recent Chats UI
      io.to(socketId).emit("updateRecentChats", newData);
      io.to(mySocketId).emit("updateRecentChats", newData);
      io.to(socketId).emit("YouAreReadMessage", {
        _id: newData._id,
        from: newData.from,
      });
    }
  });

  // Listen for invitation
  socket.on("sendInvitaion", async (data) => {
    const invitation = await Invitation.findOne({
      from: data.from,
      to: data.to,
    });
    const receiverSocket = onlineUsers.get(data.to);
    if (receiverSocket !== undefined) {
      if (data.type === "sent") {
        const response = {
          from: data.from,
          to: data.to,
          username: data.username,
          image: data?.image,
          fromMe: false,
          sentAt: invitation?.createdAt,
        };
        io.to(receiverSocket).emit("getInvitation", {
          ...response,
          type: data.type,
        });
      } else if (data.type === "cancel") {
        io.to(receiverSocket).emit("getInvitation", {
          from: data.from,
          type: data.type,
        });
      } else if (data.type === "reject") {
        const senderSocket = onlineUsers.get(data.from);
        if (senderSocket !== undefined)
          io.to(senderSocket).emit("getInvitation", {
            to: data.to,
            type: data.type,
          });
      } else {
        const senderSocket = onlineUsers.get(data.from);
        if (senderSocket !== undefined)
          io.to(senderSocket).emit("getInvitation", {
            to: data.to,
            type: data.type,
          });
      }
    }
  });

  // Listen for messages 'Read'
  socket.on("updateStatusToRead", (data) => {
    const socketId = onlineUsers.get(data.selectedUserId);
    if (socketId !== undefined)
      io.to(socketId).emit("updateMessageStatusToRead", {
        friendId: data.userId,
      });
  });

  //Listen for one message 'read'
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

  // Typing
  socket.on("typing", (data) => {
    const socketId = onlineUsers.get(data.to);
    if (socketId !== undefined) {
      io.to(socketId).emit("isTyping", { from: data.from, isTyping: true });
    }
  });

  // Not Typing
  socket.on("notTyping", (data) => {
    const socketId = onlineUsers.get(data.to);
    if (socketId !== undefined) {
      io.to(socketId).emit("isTyping", { from: data.from, isTyping: false });
    }
  });

  // Logout
  socket.on("logout", async (id) => {
    onlineUsers.delete(id);
    const user = await User.findByIdAndUpdate(
      id,
      {
        lastConnection: new Date(),
      },
      { new: true }
    );
    // Get Friends to send (Offline)
    const friendsSocket = user.friends.map((friend) => ({
      socket: onlineUsers.get(friend.toString()),
    }));
    const onlineFriends = friendsSocket.filter(
      (element) => element.socket !== undefined
    );
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

  socket.on("disconnect", async () => {
    for (let [key, value] of onlineUsers.entries()) {
      if (value === socket.id) {
        onlineUsers.delete(key);
        const user = await User.findByIdAndUpdate(
          key,
          {
            lastConnection: new Date(),
          },
          { new: true }
        );
        // Get Friends to send (Offline)
        const friendsSocket = user.friends.map((friend) => ({
          socket: onlineUsers.get(friend.toString()),
        }));
        const onlineFriends = friendsSocket.filter(
          (element) => element.socket !== undefined
        );
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
});
