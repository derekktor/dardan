const express = require("express");
const router = express.Router();
const {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  deleteTests,
  deleteAll,
} = require("../controllers/orderController.js");
// const { protect } = require("../middleware/authMiddleware.js");
const verifyJWT = require("../middleware/verifyJWT.js");

router.use(verifyJWT);

router.route("/").get(getOrders).post(createOrder);
router.route("/tests").delete(deleteTests);
router.route("/all").delete(deleteAll);
router.route("/:id").patch(updateOrder).delete(deleteOrder);

module.exports = router;
