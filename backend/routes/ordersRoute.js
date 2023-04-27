const express = require("express");
const router = express.Router();
const {getOrder, createOrder, updateOrder, deleteOrder} = require("../controllers/orderController.js")

router.route("/").get(getOrder).post(createOrder)
router.route("/:id").put(updateOrder).delete(deleteOrder)

module.exports = router;