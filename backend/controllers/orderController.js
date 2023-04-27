const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel.js");

const getOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find();
  res.status(200).json(orders);
});

const createOrder = asyncHandler(async (req, res) => {
  const order = await Order.create({
    truck_num: {
      digits: req.body.truck_num_digits,
      letters: req.body.truck_num_letters,
    },
    load_name: req.body.load_name,
    load_weight: req.body.load_weight,
    date_left: req.body.date_left,
    tavtsan_ashiglalt: req.body.tavtsan_ashiglalt,
    puulelt: req.body.puulelt,
    forklift_usage: req.body.forklift_usage,
    crane_usage: req.body.crane_usage,
    fine1: req.body.fine1,
    fine2: req.body.fine2,
    other1: req.body.other1,
    other2: req.body.other2,
    invoice_to_302: req.body.invoice_to_302,
    invoice_to_601: req.body.invoice_to_601,
    amount_w_noat: req.body.amount_w_noat,
    amount_wo_noat: req.body.amount_wo_noat,
    client_name: req.body.client_name,
  });

  res.status(200).json({ message: "Order created", order });
});

const updateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(400);
    throw new Error("Order not found!");
  }

  const updatedOrder = await Order.findByIdAndUpdate(
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

  res
    .status(200)
    .json({ message: `updating Order ${req.params.id}`, updatedOrder });
});

const deleteOrder = asyncHandler(async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: `${req.params.id} deleted successfully` });
});

module.exports = { getOrder, createOrder, updateOrder, deleteOrder };
