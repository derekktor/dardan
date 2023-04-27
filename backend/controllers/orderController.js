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
  });

  res.status(200).json({ message: "Order created", order });
});

const updateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(400);
    throw new Error("Order not found!");
  }

  console.log(req.body);

  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    {
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
