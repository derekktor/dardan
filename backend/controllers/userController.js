const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const Order = require("../models/orderModel.js");

// @route     GET /users
// @paylod    { }
// @response  { message, data }
// @desc      Get all users
// @access    Private
const getUsers = asyncHandler(async (req, res) => {
  // const users = await User.find().select("-password").lean();
  const users = await User.find().lean();

  // check if there are any users
  if (!users?.length) {
    return res.status(200).json({ message: "No users found!", users });
  }

  res
    .status(200)
    .json({ message: "showing users", numbers: users.length, data: users });
  // if (req.user && req.user.roles.includes("admin")) {
  //   const users = await User.find().select("-password").lean();

  //   // check if there are any users
  //   if (!users?.length) {
  //     return res.status(400).json({ message: "No users found!" });
  //   }

  //   res.status(200).json({ message: "showing users", users });
  // }
});

// @route     POST /users
// @paylod    { name, password }
// @response  { message, data, token }
// @desc      Registers user
// @access    Public
const createUser = asyncHandler(async (req, res) => {
  const { name, password, roles } = req.body;

  // check if client correctly filled all info
  // if (!name || !password || !Array.isArray(roles) || !roles.length) {
  if (!name || !password) {
    // throw new Error("Ner, password, alban tushaalaa oruulna uu!");
    return res.status(408).json({ message: "Нэр болон нууц үгийг оруулна уу" });
  }

  // check if user exists
  const userExists = await User.findOne({ name }).lean().exec();

  if (userExists) {
    return res.status(409).json({
      message: `${name} нэртэй хэрэглэгч байна`,
      description: "Өөр нэр сонгоно уу!",
    });
    throw new Error(`${name} nertei hereglegch burtgeltei bn!`);
  }

  // hash password
  // const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const user = await User.create({
    name,
    password: hashedPassword,
    roles: roles ? roles : ""
  });

  if (user) {
    res.status(200).json({
      message: `${name} нэр дээр бүртгэл үүслээ`,
      data: user,
      token: generateToken(user._id),
    });
  } else {
    return res.status(400).json({ message: "Өгөгдөл буруу байна" });
    throw new Error("Medeelel aldaatai baina!");
  }
});

// @route     GET /users/me
// @paylod    { }
// @response  { data }
// @desc      Get currently logged in user's information
// @access    Public
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ data: req.user });
});

// @route     POST /users/login
// @paylod    { name, password }
// @response  { id, name, token }
// @desc      Get currently logged in user's information
// @access    Public
const loginUser = asyncHandler(async (req, res) => {
  const { name, password } = req.body;

  const user = await User.findOne({ name });

  if (!user) {
    res.status(400);
    throw new Error(`${name} ner deer burtgel baihgui baina!`);
  }

  if (await bcrypt.compare(password, user.password)) {
    res.json({
      id: user.id,
      name: user.name,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Нууц үг буруу байна");
  }
});

// @route     PATCH /users/id
// @paylod    { name, password, roles }
// @response  { message, data: { name, password, roles } }
// @desc      Update user
// @access    Public
const updateUser = asyncHandler(async (req, res) => {
  const { name, password, roles } = req.body;

  // check if info entered is valid
  // if (!name || !Array.isArray(roles) || !roles.length) {
  if (!(name || password || roles)) {
    return res.status(400).json({ message: "Өөрчлөх өгөгдлийг оруулна уу" });
  }

  if (roles) {
    if (Array.isArray(roles)) {
      if (!roles.some((role) => ["employee", "admin"].includes(role))) {
        return res
          .status(400)
          .json({ message: "employee, admin хоёрын аль нэг байх хэрэгтэй" });
      }
    } else {
      return res.status(400).json({ message: "Array оруулах ёстой" });
    }
  }

  // check if user exists
  const user = await User.findById(req.params.id).exec();
  if (!user) {
    return res.status(400).json({
      message: `${req.params.id} дугаартай хэрэглэгч бүртгэлгүй байна`,
    });
    throw new Error("User not found!");
  }

  // check for duplicates
  if (name) {
    const duplicate = await User.findOne({ name }).lean().exec();

    console.log(name);
    console.log(duplicate);
    if (duplicate && duplicate?._id.toString() !== req.params.id) {
      return res.status(409).json({ message: `${name} нэр бүртгэлтэй байна` });
    }
  }

  // change the data
  user.name = name ? name : user.name;
  user.roles = roles ? roles : user.roles;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  res.status(200).json({
    message: `${updatedUser.name} хэрэглэгчийн мэдээллийг өөрчиллөө`,
    data: updatedUser,
  });
});

// @route     DELETE /users/id
// @paylod    { }
// @response  { message, id }
// @desc      Delete user
// @access    Private
const deleteUser = asyncHandler(async (req, res) => {
  // check if there are any orders created by this user
  const order = await Order.findOne({ created_by_id: req.params.id })
    .lean()
    .exec();

  if (order) {
    return res
      .status(400)
      .json({ message: `Энэ хэрэглэгчийн үүсгэсэн бүртгэлүүд байна` });
  }

  // const user = await User.findByIdAndDelete(req.params.id);
  const user = await User.findById(req.params.id).exec();

  // check if user exists
  if (!user) {
    return res
      .status(400)
      .json({ message: `${req.params.id} дугаартай хэрэглэгч байхгүй байна` });
  }

  const result = await user.deleteOne();
  const reply = `${user._id} дугаартай ${result.name} хэрэглэгчийн бүртгэлийг устгалаа`;

  res.status(200).json({ message: reply, data: result });
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  getUsers,
  getMe,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
};
