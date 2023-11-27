const express = require("express");
const {
  registerUser,
  authUser,
  getAllUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", authUser);
router.get("/allusers", protect, getAllUsers);

module.exports = router;
