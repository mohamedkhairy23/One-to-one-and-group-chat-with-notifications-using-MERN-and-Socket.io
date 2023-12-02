const express = require("express");
const {
  sendMessage,
  getAllMessagesForSingleChat,
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, getAllMessagesForSingleChat);

module.exports = router;
