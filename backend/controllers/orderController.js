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
    puulelt,
    truck_id_digits,
    truck_id_letters,
    truck_type,
    load_name,
    description,
    load_weight,
    others,
  } = req.body;

  // check if required data is filled
  // if (!load_name) {
  //   return res
  //     .status(400)
  //     .json({ message: "Хэрэгтэй бүх мэдээллийг оруулна уу" });
  // }

  let newOrder, newOrderDuplicate;
  // if only puulelt was done
  if (puulelt === "1" || puulelt === "2") {
    newOrder = await Order.create({
      created_by,
      date_entered,
      date_left: new Date(),
      puulelt,
      truck_id_digits,
      truck_id_letters,
      truck_type,
      load_name,
      description,
      load_weight,
      others,
      stage: 2,
    });
    // if util car was entered
  } else if (others === "1" || others === "2") {
    newOrder = await Order.create({
      created_by,
      date_entered,
      date_left: new Date(),
      puulelt,
      truck_id_digits,
      truck_id_letters,
      truck_type,
      load_name,
      description,
      load_weight,
      others,
      stage: 3,
    });
  } else {
    newOrder = await Order.create({
      created_by,
      date_entered,
      puulelt,
      truck_id_digits,
      truck_id_letters,
      truck_type,
      load_name,
      description,
      load_weight,
      others,
      stage: 0,
    });
  }

  // if order is created, notify
  if (newOrder) {
    console.log("order created");
    res.status(200).json({ message: "Бүртгэл нэмэгдлээ", data: newOrder });
  } else {
    console.log("order failed");
    return res.status(400).json({ message: "Order data is invalid" });
  }

  // add extra order for chirguul
  if (truck_type === "1") {
    newOrderDuplicate = await Order.create({
      created_by,
      date_entered,
      puulelt,
      truck_id_digits,
      truck_id_letters,
      truck_type,
      load_name,
      description: `${truck_id_digits} ${truck_id_letters} чиргүүл`,
      load_weight,
      others,
      stage: 0,
    });

    // if order is created, notify
    if (newOrderDuplicate) {
      res
        .status(200)
        .json({ message: "Бүртгэл нэмэгдлээ", data: newOrderDuplicate });
    } else {
      return res.status(400).json({ message: "Order data is invalid" });
    }
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
    description,
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
    gaaliin_meduulgiin_dugaar,
    last_edited_by,
    stage,
  } = req.body;

  // check if data entered is valid
  // if (!truck_num_digits || !truck_num_letters || !load_name || !date_entered || !date_left) {
  // if (!(load_name || client_name)) {
  //   return res.status(400).json({ message: "Өөрчлөлт хийнэ үү" });
  // }

  // check if order exists
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(400).json({ message: "Бүртгэл олдсонгүй" });
  }

  console.log(date_left, stage);

  order.date_entered = date_entered ? date_entered : order.date_entered;
  order.truck_id_digits = truck_id_digits
    ? truck_id_digits
    : order.truck_id_digits;
  order.truck_id_letters = truck_id_letters
    ? truck_id_letters
    : order.truck_id_letters;
  order.load_name = load_name ? load_name : order.load_name;
  order.description = description ? description : order.description;
  order.load_weight = load_weight ? load_weight : order.load_weight;
  order.date_left = date_left ? date_left : null;
  order.tavtsan_usage = tavtsan_usage ? tavtsan_usage : order.tavtsan_usage;
  order.puulelt = puulelt ? puulelt : 0;
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
  order.gaaliin_meduulgiin_dugaar = gaaliin_meduulgiin_dugaar
    ? gaaliin_meduulgiin_dugaar
    : order.gaaliin_meduulgiin_dugaar;
  order.last_edited_by = last_edited_by ? last_edited_by : order.last_edited_by;
  order.stage = stage;

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

// @route     DELETE /orders/all
// @payload   {  }
// @response  { message, data }
// @access    Public
// @desc      Delete all records
const deleteAll = asyncHandler(async (req, res) => {
  try {
    const testDeletions = await Order.deleteMany();

    if (testDeletions) {
      return res
        .status(200)
        .json({ message: "all orders deleted", data: testDeletions });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "failed to delete test orders", error: error.message });
  }
});

// @route     DELETE /orders/tests
// @payload   {  }
// @response  { message, data }
// @access    Public
// @desc      Delete test orders
const deleteTests = asyncHandler(async (req, res) => {
  try {
    const userTest = await User.findOne({ name: "test" });

    if (!userTest) {
      return res.status(404).json({ message: "test user not found!" });
    }

    
    const testDeletions = await Order.deleteMany({
      created_by: userTest._id.toString(),
    });
    
    console.log(`deleting tests: test_user(${userTest}), records(${testDeletions})`)

    if (testDeletions) {
      return res
        .status(200)
        .json({ message: "test orders deleted", data: testDeletions });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "failed to delete test orders", error: error.message });
  }
});

module.exports = {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  deleteTests,
  deleteAll
};
