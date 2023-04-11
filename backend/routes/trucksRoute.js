const express = require("express");
const router = express.Router();
const {getTruck, createTruck, updateTruck, deleteTruck} = require("../controllers/truckController.js")

router.route("/").get(getTruck).post(createTruck)
router.route("/:id").put(updateTruck).delete(deleteTruck)

module.exports = router;