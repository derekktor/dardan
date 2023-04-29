const express = require("express");
const router = express.Router();
const {getOrders, createOrder, updateOrder, deleteOrder} = require("../controllers/orderController.js")
const {protect} = require("../middleware/authMiddleware.js");

// router.route("/").get(protect, getOrders).post(protect, createOrder)
// router.route("/:id").put(protect, updateOrder).delete(protect, deleteOrder)
router.route("/").get(getOrders).post(createOrder)
router.route("/:id").patch(updateOrder).delete(deleteOrder)

module.exports = router;