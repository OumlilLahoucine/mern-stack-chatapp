const router = require("express").Router();
const authController = require("./../controllers/authController");
const multer = require("multer");

const profileImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/profile/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadProfileImage = multer({ storage: profileImageStorage });

router.post(
  "/register",
  uploadProfileImage.single("image"),
  authController.register
);
router.post("/login", authController.login);

module.exports = router;
