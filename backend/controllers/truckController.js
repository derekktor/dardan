const asyncHandler = require("express-async-handler")

const getTruck = asyncHandler(async (req, res) => {
    res.status(200).json({message: "showing Trucks"})
})

const createTruck = asyncHandler(async (req, res) => {
    if (!req.body.name) {
        res.status(400)
        throw new Error("Please add name!");
    }
    res.status(200).json({message: "creating Truck"})
})

const updateTruck = asyncHandler(async (req, res) => {
    res.status(200).json({message: `updating Truck ${req.params.id}`})
})

const deleteTruck = asyncHandler(async (req, res) => {
    res.status(200).json({message: "showing Trucks"})
})

module.exports = {getTruck, createTruck, updateTruck, deleteTruck}