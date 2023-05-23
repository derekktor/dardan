const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getMe,
  loginUser,
} = require("../controllers/userController.js");
const verifyJWT = require("../middleware/verifyJWT.js");
// const { protect } = require("../middleware/authMiddleware.js");

router.use(verifyJWT);

// router.route("/").get(protect, getUsers).post(createUser);
router.route("/").get(getUsers).post(createUser);
// router.route("/:id").patch(protect, updateUser).delete(protect, deleteUser);
router.route("/:id").patch(updateUser).delete(deleteUser);
// router.get("/me", protect, getMe);
// router.post("/login", loginUser);

module.exports = router;
