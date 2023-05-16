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
  const {
    // initial
    created_by,
    date_entered,
    truck_id_digits,
    truck_id_letters,
    load_name,
    load_weight,
  } = req.body;

  // check if required data is filled
  if (!load_name) {
    return res
      .status(400)
      .json({ message: "Хэрэгтэй бүх мэдээллийг оруулна уу" });
  }

  // create order in mongodb
  const newOrder = await Order.create({
    created_by,
    date_entered,
    truck_id_digits,
    truck_id_letters,
    load_name,
    load_weight,
    stage: 0,
  });

  // if order is created, notify
  if (newOrder) {
    res.status(200).json({ message: "Бүртгэл нэмэгдлээ", data: newOrder });
  } else {
    return res.status(400).json({ message: "Order data is invalid" });
  }
});

// @route     PATCH /orders/id
// @payload   { load_name, client_name }
// @response  { message, data }
// @access    Public
// @desc      Update order info
const updateOrder = asyncHandler(async (req, res) => {
  const {
    date_entered,
    truck_id_digits,
    truck_id_letters,
    load_name,
    load_weight,
    date_left,
    tavtsan_usage,
    puulelt,
    forklift_usage,
    crane_usage,
    fine1,
    fine2,
    other1,
    other2,
    invoice_to_302,
    invoice_to_601,
    amount_w_noat,
    amount_wo_noat,
    client_name,
    last_edited_by,
    stage
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
  }

  console.log(fine1, fine2, other1, other2)

  order.date_entered = date_entered ? date_entered : order.date_entered;
  order.truck_id_digits = truck_id_digits ? truck_id_digits : order.truck_id_digits;
  order.truck_id_letters = truck_id_letters ? truck_id_letters : order.truck_id_letters;
  order.load_name = load_name ? load_name : order.load_name;
  order.load_weight = load_weight ? load_weight : order.load_weight;
  order.date_left = date_left ? date_left : order.date_left;
  order.tavtsan_usage = tavtsan_usage
    ? tavtsan_usage
    : order.tavtsan_usage;
  order.puulelt = puulelt ? puulelt : 0
  order.forklift_usage = forklift_usage ? forklift_usage : order.forklift_usage;
  order.crane_usage = crane_usage ? crane_usage : order.crane_usage;
  order.fine1 = fine1 ? fine1 : false;
  order.fine2 = fine2 ? fine2 : false;
  order.other1 = other1 ? other1 : false;
  order.other2 = other2 ? other2 : false;
  order.invoice_to_302 = invoice_to_302 ? invoice_to_302 : order.invoice_to_302;
  order.invoice_to_601 = invoice_to_601 ? invoice_to_601 : order.invoice_to_601;
  order.amount_w_noat = amount_w_noat ? amount_w_noat : order.amount_w_noat;
  order.amount_wo_noat = amount_wo_noat ? amount_wo_noat : order.amount_wo_noat;
  order.client_name = client_name ? client_name : order.client_name;
  order.last_edited_by = last_edited_by ? last_edited_by : order.last_edited_by;
  order.stage = stage ? stage : order.stage;

  console.log(order.fine1, order.fine2, order.other1, order.other2)

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
