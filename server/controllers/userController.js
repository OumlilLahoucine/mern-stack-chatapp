const catchAsync = require("../utils/catchAsync");
const User = require("./../models/userModel");
const Message = require("./../models/messageModel");
const Invitation = require("../models/invitationModel");

exports.getRecentChats = catchAsync(async (req, res, next) => {
  const currentUser = req.user;
  const userId = currentUser._id;
  const friendsIds = currentUser.friends;

  // Get friends
  const friends = await Promise.all(
    friendsIds.map((id) =>
      User.findById(id).select("username image lastConnection")
    )
  );
  // Get last message foreach friend
  const messages = await Promise.all(
    friends.map((friend) =>
      Message.findOne({
        $or: [
          { from: userId, to: friend.id },
          { from: friend.id, to: userId },
        ],
      }).sort("-createdAt")
    )
  );

  const unreadMessages = await Promise.all(
    friends.map((friend) =>
      Message.find({ from: friend.id, to: userId, status: { $ne: "read" } })
    )
  );

  let data = [];

  // Organize response
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    if (messages[i]) {
      const message = messages[i];
      const doc = {
        userId: friend._id,
        username: friend.username,
        image: friend?.image,
        isMessage: true,
        content: message.content,
        fromMe: friend._id.equals(message.to),
        status: message.status,
        createdAt: message.createdAt,
        unread: unreadMessages[i].length,
        lastConnection: friend?.lastConnection,
      };
      data.push(doc);
    } else {
      const doc = {
        userId: friend._id,
        username: friend.username,
        image: friend?.image,
        isMessage: false,
        lastConnection: friend?.lastConnection,
      };
      data.push(doc);
    }
  }

  res.status(200).json({ status: "success", numResults: data.length, data });
});

exports.searchUsers = catchAsync(async (req, res, next) => {
  const currentUserId = req.user._id;
  const searchQuery = req.query.s;
  const friends = req.user.friends;
  const notAllowed = [...friends, currentUserId];

  // Get Users
  const users = await User.find({
    _id: { $nin: notAllowed },
    username: { $regex: searchQuery, $options: "i" },
  }).select("username image");

  // Get Invitations Status
  const invitations = await Promise.all(
    users.map((user) =>
      Invitation.findOne({
        $or: [
          { from: currentUserId, to: user._id },
          { from: user._id, to: currentUserId },
        ],
      })
    )
  );

  // Combine arrays
  let data = [];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const invitation = invitations[i];
    let fromMe;
    if (invitation) {
      fromMe = currentUserId.equals(invitation.from);
    } else {
      fromMe = null;
    }
    const doc = {
      _id: user._id,
      username: user.username,
      image: user.image,
      fromMe,
    };
    data.push(doc);
  }

  res.status(200).json({
    status: "success",
    numResults: data.length,
    data,
  });
});

exports.searchFriends = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const searchQuery = req.query.s;
  const friendsIds = req.user.friends;

  // Get Friends
  const friends = await User.find({
    _id: { $in: friendsIds },
    username: { $regex: searchQuery, $options: "i" },
  }).select("username image lastConnection");

  // Get last message foreach friend
  const messages = await Promise.all(
    friends.map((friend) =>
      Message.findOne({
        $or: [
          { from: userId, to: friend.id },
          { from: friend.id, to: userId },
        ],
      }).sort("-createdAt")
    )
  );

  const unreadMessages = await Promise.all(
    friends.map((friend) =>
      Message.find({ from: friend.id, to: userId, status: { $ne: "read" } })
    )
  );

  let data = [];

  // Organize response
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    if (messages[i]) {
      const message = messages[i];
      const doc = {
        userId: friend._id,
        username: friend.username,
        image: friend?.image,
        isMessage: true,
        content: message.content,
        fromMe: friend._id.equals(message.to),
        status: message.status,
        createdAt: message.createdAt,
        unread: unreadMessages[i].length,
        lastConnection: friend?.lastConnection,
      };
      data.push(doc);
    } else {
      const doc = {
        userId: friend._id,
        username: friend.username,
        image: friend?.image,
        isMessage: false,
        lastConnection: friend?.lastConnection,
      };
      data.push(doc);
    }
  }

  res.status(200).json({ status: "success", numResults: data.length, data });
});
