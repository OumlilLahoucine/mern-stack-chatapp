const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { promisify } = require("util");

// ##############################################################################

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const username = user.username;
  const _id = user._id;
  const image = user.image;
  res
    .status(statusCode)
    .json({ status: "success", data: { token, username, _id, image } });
};

// ##############################################################################
// Register

exports.register = catchAsync(async (req, res, next) => {
  // Create user
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    image: req.file?.filename,
  });

  // Create and send token
  sendToken(user, 200, res);
});

// ##############################################################################
// Login

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // Check if email and password are exists
  if (!email || !password)
    return next(new AppError("Please provide email and password", 400));

  // Check if the user is exist and the password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError("Incorrect email or password", 401));

  // Set online state to TRUE
  user.online = true;
  await user.save({ validateBeforeSave: false });
  // Create and send token
  sendToken(user, 200, res);
});

// ##############################################################################
// Protect route

exports.protect = catchAsync(async (req, res, next) => {
  // Check if the token exist

  let token = "";

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // return next(new AppError("You are not logged in", 401));

  if (!token) {
    return next(new AppError("You are not logged in", 401));
  }

  // Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if the user still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError(
        "The user belonging to this token does not longer exist",
        401
      )
    );

  // Check if user password changed after the token was issued
  if (currentUser.passwordChangedAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again", 401)
    );
  }

  // Add user to request
  req.user = currentUser;
  next();
});
