const router = require("express").Router();
const { protect } = require("./../controllers/authController");
const userController = require("./../controllers/userController");

router.use(protect);

router.get("/recent", userController.getRecentChats);
router.get("/friends", userController.searchFriends);
router.get("/", userController.searchUsers);

module.exports = router;
