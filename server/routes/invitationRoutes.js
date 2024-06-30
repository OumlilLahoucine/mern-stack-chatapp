const router = require("express").Router();
const { protect } = require("./../controllers/authController");
const invitationController = require("./../controllers/invitationController");
router.use(protect);

router.get("/invitations", invitationController.getInvitations);
router.post("/:userId/invite", invitationController.inviteUser);
router.delete("/:userId/cancelInvite", invitationController.cancelInviteUser);
router.patch("/:userId/accept", invitationController.acceptInvitation);

module.exports = router;
