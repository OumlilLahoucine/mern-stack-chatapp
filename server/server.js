const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const mongoose = require("mongoose");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const server = createServer(app);

// Models
const User = require("./models/userModel");
const Invitation = require("./models/invitationModel");
const Message = require("./models/messageModel");

// Listeners
const newUserListener = require("./listeners/newUserListener");
const setOnlineListener = require("./listeners/setOnlineListener");
const addMessageListener = require("./listeners/addMessageListener");
const iReadMessageListener = require("./listeners/iReadMessageListener");
const sendInvitationListener = require("./listeners/sendInvitationListener");
const updateStatusToReadListener = require("./listeners/updateStatusToReadListener");
const typingListener = require("./listeners/typingListener");
const logoutListener = require("./listeners/logoutListener");
const disconnectListener = require("./listeners/disconnectListener");

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
  cors: { origin: process.env.CORS_ORIGIN },
});

// const onlineUsers = {};
const onlineUsers = new Map();

// Socket IO
io.on("connection", (socket) => {
  // Listening for a new user
  newUserListener(socket, io, onlineUsers);

  // Listen for invitation
  sendInvitationListener(socket, io, onlineUsers);

  // Update onlineFriends When Accept Invitation (add New friend to onlineFriends, also add a recent chats)
  setOnlineListener(socket, io, onlineUsers);

  // Listening for a new message
  addMessageListener(socket, io, onlineUsers);

  // Update message status to 'read' on open a discussion
  updateStatusToReadListener(socket, io, onlineUsers);

  //Listen for one message 'I read the message read' (Response of YouAreReadMessage)
  iReadMessageListener(socket, io, onlineUsers);

  // Typing
  typingListener(socket, io, onlineUsers);

  // Logout
  logoutListener(socket, io, onlineUsers);

  // Disconnect
  disconnectListener(socket, io, onlineUsers);
});
