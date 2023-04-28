const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel.js");
const User = require("../models/userModel.js");

const getOrder = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  let orders;

  // show all orders if its admin
  if (user.role === "admin") {
    orders = await Order.find();
  } else if (user.role === "employee") {
    orders = await Order.find({ created_by_id: req.user.id });
  } else {
    res.status(400);
    throw new Error("Invalid role!")
  }

  res.status(200).json(orders);
});

const createOrder = asyncHandler(async (req, res) => {
  const order = await Order.create({
    created_by_id: req.user.id,
    created_by_name: req.user.name,
    truck_num: {
      digits: req.body.truck_num_digits,
      letters: req.body.truck_num_letters,
    },
    load_name: req.body.load_name,
    // load_weight: req.body.load_weight,
    // date_left: req.body.date_left,
    // tavtsan_ashiglalt: req.body.tavtsan_ashiglalt,
    // puulelt: req.body.puulelt,
    // forklift_usage: req.body.forklift_usage,
    // crane_usage: req.body.crane_usage,
    // fine1: req.body.fine1,
    // fine2: req.body.fine2,
    // other1: req.body.other1,
    // other2: req.body.other2,
    // invoice_to_302: req.body.invoice_to_302,
    // invoice_to_601: req.body.invoice_to_601,
    // amount_w_noat: req.body.amount_w_noat,
    // amount_wo_noat: req.body.amount_wo_noat,
    // client_name: req.body.client_name,
  });

  res.status(200).json({ message: "Order created", order });
});

const updateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(400);
    throw new Error("Order not found!");
  }

  // check if user exists
  if (!req.user) {
    res.status(401);
    throw new Error("Hereglegch burtgelgui baina!");
  }

  let updatedOrder;
  // limit access to update someone else's record
  if (
    req.user.role === "admin" ||
    order.created_by.toString() === req.user.id
  ) {
    updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        truck_num: {
          digits: req.body.truck_num_digits,
          letters: req.body.truck_num_letters,
        },
      },
      { new: true }
    );
  } else {
    res.status(401);
    throw new Error("Ene uildliig hiih erh baihgui baina!");
  }

  res
    .status(200)
    .json({ message: `updating Order ${req.params.id}`, updatedOrder });
});

const deleteOrder = asyncHandler(async (req, res) => {
  // check if user exists
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("Hereglegch burtgelgui baina!");
  }

  const order = await Order.findById(req.params.id);
  // limit access to update someone else's record
  if (user.role === "admin" || order.created_by.toString() === user.id) {
    await Order.findByIdAndRemove(req.params.id);
  } else {
    res.status(401);
    throw new Error("Ene uildliig hiih erh baihgui baina!");
  }

  res.status(200).json({ message: `${req.params.id} deleted successfully` });
});

module.exports = { getOrder, createOrder, updateOrder, deleteOrder };
