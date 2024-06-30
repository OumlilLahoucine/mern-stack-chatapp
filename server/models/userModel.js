const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide your full name"],
    trim: true,
    maxlength: [30, "Your name must contain a maximum of 30 characters"],
    minlength: [6, "Your name should contain at least 6 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email"],
    lowercase: true,
  },
  image: String,
  password: {
    type: String,
    required: [true, "Please provide your password"],
    minlength: [8, "Your password should contain at least 8 characters"],
    validate: [validator.isStrongPassword, "Please provide a strong password"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    minlength: [
      8,
      "Your password confirm should contain at least 8 characters",
    ],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  passwordChangedAt: Date,
  friends: [mongoose.Types.ObjectId],
  lastConnection: Date,
});

// Hash password
userSchema.pre("save", async function (next) {
  // If the password is not modified
  if (!this.isModified("password")) return next();

  // Hash the password
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordCConfirm
  this.passwordConfirm = undefined;
  next();
});

// Check if the password is correct
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Check if the password changed after the token was issued
userSchema.methods.passwordChangedAfter = function (jwtTime) {
  if (this.passwordChangerAt) {
    const changedTime = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return changedTime > jwtTime;
  }
  return false;
};

const User = new mongoose.model("User", userSchema);

module.exports = User;
