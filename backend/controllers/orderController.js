const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel.js");
const User = require("../models/userModel.js");
// JSON to CSV
const { parse } = require("json2csv");
// xlsx populate
const XlsxlPopulate = require("xlsx-populate");

// addCalculatedProperties
const addCalculatedProperties = (order) => {
  // deep copy order data coming from mongoose
  let temp = JSON.parse(JSON.stringify(order))

  // test
  // let order = await Order.findById("647ae72714f8ad31d9175b8b") // 2
  // let order = await Order.findById("647ae77e14f8ad31d9175b93") // puulelt 2
  // let order = await Order.findById("647ae8c114f8ad31d9175baf") // puulelt 1
  // let order = await Order.findById("64984b223439d08c58758c47") // puulelt 0
  // let order = await Order.findById("647ae1dd14f8ad31d9175b52") // f1 0 f2 0 o1 0 o2 0
  // let order = await Order.findById("652b6a5c14a4f8cb6066419e") // f1 1 f2 1 o1 1 o2 1
  // let order = await Order.findById("652b6a5c14a4f8cb6066419e") // tavtsan "0"
  // let order = await Order.findById("647ae65314f8ad31d9175b7b") // tavtsan "aguulah_tavtsan"
  // let order = await Order.findById("647af95014f8ad31d9175cd0") // tavtsan "gadna_tavtsan"
  // let order = await Order.findById("647af95014f8ad31d9175cd0") // forklift 0
  // let order = await Order.findById("652b6a5c14a4f8cb6066419e") // forklift neg 20k
  // let order = await Order.findById("652b6f926e0f6d0f1a339488") // forklift нэг 20k
  // let order = await Order.findById("652b6fde6e0f6d0f1a339491") // forklift 19 1m900k
  // let order = await Order.findById("647ae1dd14f8ad31d9175b52") // crane empty
  // let order = await Order.findById("64a94452efc6fcf7011006ef") // crane 0 0
  // let order = await Order.findById("652b6f926e0f6d0f1a339488") // crane 1 hooson 100k
  // let order = await Order.findById("652b6a5c14a4f8cb6066419e") // crane 2 achaatai 250k 
  // let order = await Order.findById("652b6a5c14a4f8cb6066419e") // crane 2 achaatai 250k 
  // let order = await Order.findById("652b6fde6e0f6d0f1a339491") // transfer true
  // let order = await Order.findById("653b6fde6e0f6d0f1a339491") // total 85k
  // let order = await Order.findById("64e841e9b807a2934747e1bd") // total 65k


  // initialize price object with zeros
  let price = {
    parking: 0,
    puulelt: 0,
    tavtsan: 0,
    forklift: 0,
    crane: 0,
    other: 0,
    fine: 0,
    transfer: 0,
    total: 0
  }
  let numDays = 0;

  // CALCULATION
  // parking
  // subbing shows ms, dividing by 86'400'000 shows days
  numDays = Math.round((order.date_left - order.date_entered) / 86400000);

  if (numDays >= 1 || numDays === 0) {
    price.parking = 25000;
  }

  if (numDays >= 2) {
    price.parking += 20000;
  }

  if (numDays >= 3) {
    price.parking += 15000;
  }

  if (numDays >= 4) {
    price.parking += 10000 * (numDays - 3);
  }

  // puulelt
  if (order.puulelt == 1) {
    // add 20k if puulelt 1 (suudliin mashin)
    price.puulelt = 10000;
  } else if (order.puulelt == 2) {
    // add 10k if puulelt 2 (busad)
    price.puulelt = 20000;
  }

  // fine
  if (order.fine1) {
    price.fine += 50000;
  }
  if (order.fine2) {
    price.fine += 25000;
  }

  // other
  if (order.other1) {
    price.other += 20000;
  }
  if (order.other2) {
    price.other += 10000;
  }

  // tavtsan
  if (order.tavtsan_usage == "aguulah_tavtsan") {
    price.tavtsan = 40000;
  } else if (order.tavtsan_usage == "gadna_tavtsan") {
    price.tavtsan = 20000;
  }

  // forklift
  if (order.forklift_usage == "neg" || order.forklift_usage == "нэг") {
    price.forklift = 20000;
  } else {
    let forkHours = parseInt(order.forklift_usage);
    price.forklift = forkHours * 100000;
  }

  // crane
  if (order.crane_usage == 0) {
    price.crane = 0
  } else if (order.crane_usage == 1) {
    price.crane = 100000
  } else if (order.crane_usage == 2) {
    price.crane = 250000
  } else {
    price.crane = 0
  }

  // transfer => 600k
  if (order.transfer == null) {
    order.transfer = 0
  }
  price.transfer = order.transfer ? 600000 : 0

  // total price
  price.total = price.parking + price.puulelt + price.tavtsan + price.forklift + price.crane + price.other + price.fine + price.transfer

  temp = { ...temp, numDays, total: price.total }

  return temp

}

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

// @route     GET /orders/export?year&month
// @params    year, month
// @response  { message, numbers, orders }
// @access    Public
// @desc      Get orders within a specific time range
const getOrdersWithDate = asyncHandler(async (req, res) => {
  // PREPARING CSV
  const fields = ["date_entered", "date_left", "truck_id_digits", "truck_id_letters", "load_name", "load_weight", "tavtsan_usage", "puulelt", "forklift_usage", "crane_usage", "fine1", "fine2", "other1", "other2", "numDays", "total"];
  const opts = { fields }
  let csvEh, csvOrson, csvGarsan, csvEts;

  // initialize different types of orders
  let ordersEntered, ordersEh, ordersEts, ordersLeft;

  const { year, month } = req.query;

  const startDate = new Date(new Date().getFullYear(), month - 1, 1);

  if (month == 0) {
    // ANNUAL ORDERS
    // ORDERS ENTERED: date_entered.month = month && date_entered.year = year
    ordersEntered = await Order.find({
      $expr: {
        $eq: [{ $year: "$date_entered" }, year]
      }
    });

    // ORDERS LEFT: date_left.month = month && date_left.year = year
    ordersLeft = await Order.find({
      $expr: {
        $eq: [{ $year: "$date_left" }, year]
      }
    });

    // ORDERS EH
    ordersEh = await Order.find({
      $and: [
        { date_entered: { $lt: new Date(year, 0, 1) } }, // Entered before year
        {
          $or: [
            { date_left: { $gt: new Date(year, 11, 31) } }, // Left after year
            { date_left: { $exists: false } }    // Or date_left is not set (null)
          ]
        }
      ]
    });

    // ORDERS ETS
    ordersEts = await Order.find({
      $and: [
        { date_entered: { $lte: new Date(year, 0, 1) } }, // Entered before year
        {
          $or: [
            { date_left: { $gt: new Date(year, 11, 31) } }, // Left after year
            { date_left: { $exists: false } } // Or date_left is not set (null)
          ]
        }
      ]
    });

  } else {
    // MONTHLY ORDERS
    // ORDERS ENTERED: date_entered.month = month && date_entered.year = year
    ordersEntered = await Order.find({
      $expr: {
        $and: [
          { $eq: [{ $year: "$date_entered" }, year] },
          { $eq: [{ $month: "$date_entered" }, month] },
        ]
      }
    });

    // ORDERS LEFT: date_left.month = month && date_left.year = year
    ordersLeft = await Order.find({
      $expr: {
        $and: [
          { $eq: [{ $year: "$date_left" }, year] },
          { $eq: [{ $month: "$date_left" }, month] },
        ]
      }
    });

    // ORDERS EH
    // date_en.month = month - 1 && date_left.year = year AND
    // date_left.month = month && date_left.year = year
    ordersEh = await Order.find({
      $and: [
        { date_entered: { $lt: startDate } }, // Entered before June 2023
        {
          $or: [
            { date_left: { $gt: startDate } }, // Left after June 2023
            { date_left: { $exists: false } }    // Or date_left is not set (null)
          ]
        }
      ]
    });

    // ORDERS ETS
    ordersEts = await Order.find({
      $and: [
        { date_entered: { $lte: startDate } }, // Entered before or in given date
        {
          $or: [
            { date_left: { $gt: startDate } }, // Left after given date
            { date_left: { $exists: false } } // Or date_left is not set (null)
          ]
        }
      ]
    });
  }


  ordersEh = ordersEh.map(order => {
    return addCalculatedProperties(order);
  })

  ordersEntered = ordersEntered.map(order => {
    return addCalculatedProperties(order);
  })

  ordersLeft = ordersLeft.map(order => {
    return addCalculatedProperties(order);
  })

  ordersEts = ordersEts.map(order => {
    return addCalculatedProperties(order);
  })


  try {
    csvEh = parse(ordersEh, opts)
    csvOrson = parse(ordersEntered, opts)
    csvGarsan = parse(ordersLeft, opts)
    csvEts = parse(ordersEts, opts)
  } catch (error) {
    console.error(error);
  }


  res.status(200).json({
    message: "Export endpoint hit",
    date: `${year} - ${month}`,
    ordersEnCount: ordersEntered.length,
    ordersLeftCount: ordersLeft.length,
    ordersEhCount: ordersEh.length,
    ordersEtsCount: ordersEts.length,
    eh: csvEh,
    orson: csvOrson,
    garsan: csvGarsan,
    ets: csvEts
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

  let newOrder, newOrderDuplicate;
  // if only puulelt was done, stage = 2
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
    // if util car was entered, stage = 3
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

  // if truck type = 1, add extra order for chirguul
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
    transfer,
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
  order.transfer = transfer ? transfer : false;
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
  getOrdersWithDate,
  createOrder,
  updateOrder,
  deleteOrder,
  deleteTests,
  deleteAll
};
