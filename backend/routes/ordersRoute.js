const express = require("express");
const router = express.Router();
const {getOrder, createOrder, updateOrder, deleteOrder} = require("../controllers/orderController.js")
const {protect} = require("../middleware/authMiddleware.js");

router.route("/").get(protect, getOrder).post(protect, createOrder)
router.route("/:id").put(protect, updateOrder).delete(protect, deleteOrder)

module.exports = router;