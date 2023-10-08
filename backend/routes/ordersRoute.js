const express = require("express");
const router = express.Router();
const {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  deleteTests,
  deleteAll,
  getOrdersWithDate,
} = require("../controllers/orderController.js");
// const { protect } = require("../middleware/authMiddleware.js");
const verifyJWT = require("../middleware/verifyJWT.js");

router.use(verifyJWT);

router.route("/").get(getOrders).post(createOrder);
router.route("/tests").delete(deleteTests);
router.route("/export").get(getOrdersWithDate);
// used it only for pre-publishing
router.route("/all").delete(deleteAll);
router.route("/:id").patch(updateOrder).delete(deleteOrder);

module.exports = router;
