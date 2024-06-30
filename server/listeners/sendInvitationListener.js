const Invitation = require("../models/invitationModel");

module.exports = (socket, io, onlineUsers) => {
  socket.on("sendInvitaion", async (data) => {
    // Find Invitation
    const invitation = await Invitation.findOne({
      from: data.from,
      to: data.to,
    });
    const receiverSocket = onlineUsers.get(data.to);

    // (send Response) Send, cancel, reject or accept invitation
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
};
