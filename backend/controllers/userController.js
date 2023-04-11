const asyncHandler = require("express-async-handler")
const User = require("../models/userModel.js");

const getUser = asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json({message: "showing users", users})
})

const createUser = asyncHandler(async (req, res) => {
    const user = await User.create({
        name: req.body.name,
        password: req.body.password
    })

    res.status(200).json({message: "creating user", user})
})

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(400);
        throw new Error("User not found!");
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});

    res.status(200).json({message: `updating user ${req.params.id}`, updatedUser})
})

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);

    res.status(200).json({message: `successfully deleted user ${req.params.id}`})
})

module.exports = {getUser, createUser, updateUser, deleteUser}