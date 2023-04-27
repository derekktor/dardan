const express = require("express");
const router = express.Router();
const {getUsers, createUser, updateUser, deleteUser, getMe, loginUser} = require("../controllers/userController.js")

router.route("/").get(getUsers).post(createUser)
router.route("/:id").put(updateUser).delete(deleteUser)
router.get("/me", getMe)
router.post("/login", loginUser)

module.exports = router;