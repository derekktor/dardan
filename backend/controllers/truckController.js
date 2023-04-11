const asyncHandler = require("express-async-handler")
const Truck = require("../models/truckModel.js");

const getTruck = asyncHandler(async (req, res) => {
    const trucks = await Truck.find();
    res.status(200).json(trucks)
})

const createTruck = asyncHandler(async (req, res) => {
    // if (!req.body.truck_num) {
    //     res.status(400)
    //     throw new Error("Please add name!");
    // }

    const truck = await Truck.create({
        truck_num_digits: req.body.truck_num_digits,
        truck_num_letters: req.body.truck_num_letters
    })

    res.status(200).json({message: "truck created", truck})
})

const updateTruck = asyncHandler(async (req, res) => {
    const truck = await Truck.findById(req.params.id);

    if (!truck) {
        res.status(400);
        throw new Error("Truck not found!")
    }

    const updatedTruck = await Truck.findByIdAndUpdate(req.params.id, req.body, {new: true})

    res.status(200).json({message: `updating Truck ${req.params.id}`, updatedTruck})
})

const deleteTruck = asyncHandler(async (req, res) => {
    const truck = await Truck.findByIdAndDelete(req.params.id);

    res.status(200).json({message: `${req.params.id} deleted successfully`})
})

module.exports = {getTruck, createTruck, updateTruck, deleteTruck}