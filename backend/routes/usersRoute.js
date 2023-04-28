const express = require("express");
const router = express.Router();
const {getUsers, createUser, updateUser, deleteUser, getMe, loginUser} = require("../controllers/userController.js")
const { protect } = require("../middleware/authMiddleware.js");

router.route("/").get(protect, getUsers).post(createUser)
router.route("/:id").put(protect, updateUser).delete(protect, deleteUser)
router.get("/me", protect, getMe)
router.post("/login", loginUser)

module.exports = router;