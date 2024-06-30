const catchAsync = require("../utils/catchAsync");
const User = require("./../models/userModel");
const Invitation = require("../models/invitationModel");
const AppError = require("../utils/appError");

exports.inviteUser = catchAsync(async (req, res, next) => {
  const currentUserId = req.user._id;
  const userId = req.params.userId;

  const invitation = await Invitation.findOne({
    $or: [
      { from: currentUserId, to: userId },
      { from: userId, to: currentUserId },
    ],
  });

  // Send invitation if not already exists
  if (!invitation) {
    await Invitation.create({
      from: req.user._id,
      to: req.params.userId,
    });
  }
  res.status(201).json({
    status: "success",
    data: "sent",
  });
});

exports.cancelInviteUser = catchAsync(async (req, res, next) => {
  const currentUserId = req.user._id;
  const userId = req.params.userId;

  const invitation = await Invitation.findOne({
    $or: [
      { from: currentUserId, to: userId },
      { from: userId, to: currentUserId },
    ],
  });

  // Cancel invitation if it exists
  if (invitation) {
    await Invitation.findByIdAndDelete(invitation._id);
  }
  res.status(200).json({
    status: "success",
    data: "remove",
  });
});

exports.acceptInvitation = catchAsync(async (req, res, next) => {
  const currentUserId = req.user._id;
  const userId = req.params.userId;

  const invitation = await Invitation.findOne({
    from: userId,
    to: currentUserId,
  });

  if (invitation) {
    // Affect each user to other as a friend
    await User.findByIdAndUpdate(currentUserId, { $push: { friends: userId } });
    await User.findByIdAndUpdate(userId, { $push: { friends: currentUserId } });
    // Delete the invitation
    await Invitation.findByIdAndDelete(invitation._id);

    // Return response
    return res.status(201).json({
      status: "success",
      data: "accept",
    });
  }

  next(new AppError("No invitation to accept", 400));
});

exports.getInvitations = catchAsync(async (req, res, next) => {
  const currentUserId = req.user._id;

  // Get invitations
  const invitations = await Invitation.find({
    $or: [{ to: currentUserId }, { from: currentUserId }],
  }).sort("-createdAt");

  // Get Senders
  const users = await Promise.all(
    invitations.map((inv) => {
      const userId = inv.from.equals(currentUserId) ? inv.to : inv.from;
      return User.findById(userId).select("username image");
    })
  );

  // // Combine arrays
  let data = [];
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const invitation = invitations[i];

    const doc = {
      from: invitation.from,
      to: invitation.to,
      username: user.username,
      image: user?.image || null,
      fromMe: invitation.from.equals(currentUserId),
      sentAt: invitation.createdAt,
    };
    data.push(doc);
  }

  res.status(200).json({
    status: "success",
    numResult: data.length,
    data,
  });
});
