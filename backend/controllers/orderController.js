const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel.js");
const User = require("../models/userModel.js");

// @route     GET /orders
// @payload   {  }
// @response  { message, numbers, orders }
// @access    Public
// @desc      Get orders created by the user currently logged in or all orders if the user has role of admin
const getOrders = asyncHandler(async (req, res) => {
  let orders;

  // // check for query strings
  // if (req.query) {
  //   const userId = req.query.userId;
  //   const user = await User.findById(userId);

  //   // check if userExists
  //   if (!user) {
  //     return res.status(400).json({ message: `${userId} дугаартай хэрэглэгч олдсонгүй`})
  //   }

  //   orders = await Order.find({ created_by_name: user.name});
  // } else {
  //   orders = await Order.find();
  // }

  orders = await Order.find();

  const ordersRenamed = orders.map((order) => ({
    ...order.toObject(),
    id: order._id,
  }));

  res.status(200).json({
    message: "Бүртгэлүүдийг үзүүлж байна",
    length: orders.length,
    data: ordersRenamed,
  });
});

// @route     POST /orders
// @payload   { client_name, load_name }
// @response  { message, numbers, orders }
// @access    Public
// @desc      Creates new order
const createOrder = asyncHandler(async (req, res) => {
  // destructure req body
  const { client_name, load_name, created_by_name } = req.body;

  // check if required data is filled
  if (!client_name || !load_name) {
    return res
      .status(400)
      .json({ message: "Хэрэгтэй бүх мэдээллийг оруулна уу" });
  }

  // create order in mongodb
  const newOrder = await Order.create({
    client_name,
    load_name,
    created_by_name,
  });

  // if order is created, notify
  if (newOrder) {
    res.status(200).json({ message: "Бүртгэл нэмэгдлээ", data: newOrder });
  } else {
    return res.status(400).json({ message: "Order data is invalid" });
  }
});

// @route     POST /orders
// @payload   { client_name, load_name }
// @response  { message, numbers, orders }
// @access    Public
// @desc      Create order
// const createOrder = asyncHandler(async (req, res) => {
//   const { load_name, client_name, truck_num_digits, truck_num_letters } =
//     req.body;

//   // check if necessary fields are filled in
//   if (!load_name || !client_name) {
//     return res.status(400).json({ message: "Please fill in every field!" });
//   }
//   console.log(load_name, client_name, truck_num_digits);

//   // create order
//   const order = await Order.create({
//     // truck_num: {
//     //   digits: truck_num_digits,
//     //   letters: truck_num_letters,
//     // },
//     truck_num_digits,
//     truck_num_letters,
//     load_name,
//     client_name,
//     // created_by_id: req.user.id,
//     // created_by_name: req.user.name,
//     // load_weight: req.body.load_weight,
//     // date_entered: req.body.date_entered,
//     // date_left: req.body.date_left,
//     // tavtsan_ashiglalt: req.body.tavtsan_ashiglalt,
//     // puulelt: req.body.puulelt,
//     // forklift_usage: req.body.forklift_usage,
//     // crane_usage: req.body.crane_usage,
//     // fine1: req.body.fine1,
//     // fine2: req.body.fine2,
//     // other1: req.body.other1,
//     // other2: req.body.other2,
//     // invoice_to_302: req.body.invoice_to_302,
//     // invoice_to_601: req.body.invoice_to_601,
//     // amount_w_noat: req.body.amount_w_noat,
//     // amount_wo_noat: req.body.amount_wo_noat,
//   });

//   if (order) {
//     res.status(200).json({ message: "order created successfully", order });
//   } else {
//     return res.status(400).json({ message: "Invalid order data" });
//   }
// });

// @route     PATCH /orders/id
// @payload   { load_name, client_name }
// @response  { message, data }
// @access    Public
// @desc      Update order info
const updateOrder = asyncHandler(async (req, res) => {
  const {
    truck_num_digits,
    truck_num_letters,
    load_name,
    client_name,
    date_entered,
    date_left,
  } = req.body;

  // check if data entered is valid
  // if (!truck_num_digits || !truck_num_letters || !load_name || !date_entered || !date_left) {
  if (!(load_name || client_name)) {
    return res.status(400).json({ message: "Өөрчлөлт хийнэ үү" });
  }

  // check if order exists
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(400).json({ message: "Бүртгэл олдсонгүй" });
    throw new Error("Order not found!");
  }

  // // check if user exists
  // if (!req.user) {
  //   return res.status(401).json({ message: "Hereglegch burtgelgui baina!" });
  //   throw new Error("Hereglegch burtgelgui baina!");
  // }

  order.load_name = load_name ? load_name : order.load_name;
  order.client_name = client_name ? client_name : order.client_name;

  // let updatedOrder;
  // // limit access to update someone else's record
  // if (
  //   req.user.roles.includes("admin") ||
  //   order.created_by_id.toString() === req.user.id
  // ) {
  //   updatedOrder = await order.save();
  // } else {
  //   return res
  //     .status(401)
  //     .json({ message: "Ene uildliig hiih erh baihgui bn!" });
  //   throw new Error("Ene uildliig hiih erh baihgui baina!");
  // }

  const updatedOrder = await order.save();
  updatedOrder.id = updatedOrder._id;
  res.status(200).json({ ...updatedOrder.toObject(), id: updatedOrder._id });
});

// @route     DELETE /orders/id
// @payload   {  }
// @response  { message, data }
// @access    Public
// @desc      Delete order
const deleteOrder = asyncHandler(async (req, res) => {
  // // check if user exists
  // const user = await User.findById(req.user.id);
  // if (!user) {
  //   res.status(401);
  //   throw new Error("Hereglegch burtgelgui baina!");
  // }

  const order = await Order.findById(req.params.id).exec();
  const result = await order.deleteOne();
  const reply = `${result._id} дугаартай ${result.load_name} бүртгэл устгагдлаа`;

  res.status(200).json({ message: reply, data: result });
  // limit access to update someone else's record
  // if (
  //   req.user.roles.includes("admin") ||
  //   order.created_by_id.toString() === req.user.id
  // ) {
  //   const result = await order.deleteOne();
  //   const reply = `Order ${result.load_name} with id ${result._id} was deleted successfully`;

  //   res.status(200).json({ message: reply });
  // } else {
  //   res.status(401);
  //   throw new Error("Ene uildliig hiih erh baihgui baina!");
  // }
});

module.exports = { getOrders, createOrder, updateOrder, deleteOrder };
