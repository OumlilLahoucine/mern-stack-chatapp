const router = require("express").Router();
const { protect } = require("./../controllers/authController");
const messageController = require("./../controllers/messageController");

router.use(protect);

router.post("/", messageController.postMessage);
router.get("/:id", messageController.getMessages);

module.exports = router;
