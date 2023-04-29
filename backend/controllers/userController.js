const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const Order = require("../models/orderModel.js");

// @desc Register a user or create new user
// @route POST /users
// @access Public
const createUser = asyncHandler(async (req, res) => {
  const { name, password, roles } = req.body;

  // check if client correctly filled all info
  if (!name || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "Please fill in every field!" });
    throw new Error("Ner, password, alban tushaalaa oruulna uu!");
  }

  // check if user exists
  const userExists = await User.findOne({ name }).lean().exec();

  if (userExists) {
    return res.status(409).json({ message: "Duplicate username" });
    throw new Error(`${name} nertei hereglegch burtgeltei bn!`);
  }

  // hash password
  // const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const user = await User.create({
    name,
    password: hashedPassword,
    roles,
  });

  if (user) {
    res.status(201).json({
      message: `${name} burtgel amjilttai`,
      user,
      token: generateToken(user._id),
    });
  } else {
    return res.status(400).json({ message: "Invalid user data" });
    throw new Error("Medeelel aldaatai baina!");
  }
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ message: req.user });
});

const loginUser = asyncHandler(async (req, res) => {
  const { name, password } = req.body;

  const user = await User.findOne({ name });

  if (!user) {
    res.status(400);
    throw new Error(`${name} ner deer burtgel baihgui baina!`);
  }

  if (await bcrypt.compare(password, user.password)) {
    res.json({
      _id: user.id,
      name: user.name,
      role: user.role,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Password buruu bn!");
  }

  res.status(200).json({ message: "logging in user" });
});

// @desc Get all users
// @route GET /users
// @access Private
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();

  // check if there are any users
  if (!users?.length) {
    return res.status(400).json({ message: "No users found!" });
  }

  res.status(200).json({ message: "showing users", users });
  // if (req.user && req.user.roles.includes("admin")) {
  //   const users = await User.find().select("-password").lean();

  //   // check if there are any users
  //   if (!users?.length) {
  //     return res.status(400).json({ message: "No users found!" });
  //   }

  //   res.status(200).json({ message: "showing users", users });
  // }
});

// @desc Update user
// @route PATCH /users/id
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { name, password, roles } = req.body;

  // check if info entered is valid
  if (!name || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "Please provide every detail!" });
  }

  const user = await User.findById(req.params.id).exec();

  // check if user exists
  if (!user) {
    return res.status(400).json({ message: "User doesn't exist!" });
    throw new Error("User not found!");
  }

  // check for duplicates
  const duplicate = await User.findOne({ name }).lean().exec();
  if (duplicate && duplicate?._id.toString() !== req.params.id) {
    return res.status(409).json({ message: "Username already exists" });
  }

  user.name = name;
  user.roles = roles;

  if (password) {
    // hash password
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  res.status(200).json({ message: `Updated user ${name}`, updatedUser });
});

// @desc Delete user
// @route DELETE /users/id
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  // check if there are any orders created by this user
  const order = await Order.findOne({ created_by_id: req.params.id })
    .lean()
    .exec();

  if (order) {
    return res.status(400).json({ message: "User has orders" });
  }

  // const user = await User.findByIdAndDelete(req.params.id);
  const user = await User.findById(req.params.id).exec();

  // check if user exists
  if (!user) {
    return res
      .status(400)
      .json({ message: "User with given id doesn't exist!" });
  }

  const result = await user.deleteOne();
  const reply = `User ${result.name} with id ${user._id} was deleted successfully`;

  res.status(200).json({ message: reply });
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
