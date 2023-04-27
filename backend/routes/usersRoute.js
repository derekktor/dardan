const express = require("express");
const router = express.Router();
const {getUsers, createUser, updateUser, deleteUser, getMe, loginUser} = require("../controllers/userController.js")
const { protect } = require("../middleware/authMiddleware.js");

router.route("/").get(getUsers).post(createUser)
router.route("/:id").put(updateUser).delete(deleteUser)
router.get("/me", protect, getMe)
router.post("/login", loginUser)

module.exports = router;