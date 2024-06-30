const catchAsync = require("../utils/catchAsync");
const Message = require("./../models/messageModel");
const AppError = require("./../utils/appError");

exports.postMessage = catchAsync(async (req, res, next) => {
  const currentUser = req.user;
  const fromId = currentUser._id;
  const toId = req.body.to;

  if (!currentUser.friends.includes(toId)) {
    return next(
      new AppError(
        "You can send messages just to your friends! Send an invitation first.",
        400
      )
    );
  }

  const message = await Message.create({
    from: fromId,
    to: toId,
    content: req.body.content,
  });
  res.status(201).json({ status: "success", data: message });
});

exports.getMessages = catchAsync(async (req, res, next) => {
  const currentUser = req.user;
  const userId = currentUser._id;
  const friendId = req.params.id;

  if (!currentUser.friends.includes(friendId)) {
    return next(
      new AppError("This user is not a friend. Send an invitation first.", 400)
    );
  }

  let messages = [];
  // Change Messages Status
  await Message.updateMany(
    { from: friendId, to: userId, status: { $ne: "read" } },
    { $set: { status: "read" } }
  );

  // Get Messages
  messages = await Message.find({
    $or: [
      { from: userId, to: friendId },
      { from: friendId, to: userId },
    ],
  });

  res
    .status(200)
    .json({ status: "success", numResults: messages.length, data: messages });
});
