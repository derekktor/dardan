const asyncHandler = require("express-async-handler")

const getUser = asyncHandler(async (req, res) => {
    res.status(200).json({message: "showing users"})
})

const createUser = asyncHandler(async (req, res) => {
    if (!req.body.name) {
        res.status(400)
        throw new Error("Please add name!");
    }
    res.status(200).json({message: "creating user"})
})

const updateUser = asyncHandler(async (req, res) => {
    res.status(200).json({message: `updating user ${req.params.id}`})
})

const deleteUser = asyncHandler(async (req, res) => {
    res.status(200).json({message: "showing users"})
})

module.exports = {getUser, createUser, updateUser, deleteUser}