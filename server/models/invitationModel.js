const mongoose = require("mongoose");

const invitationSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    to: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Invitation = new mongoose.model("Invitation", invitationSchema);

module.exports = Invitation;
