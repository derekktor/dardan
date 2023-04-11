const mongoose = require("mongoose");

const truckSchema = mongoose.Schema(
  {
    truck_num_digits: {
      type: String,
      required: [true, "Арлын дугаарын тоог оруулна уу!"],
    },
    truck_num_letters: {
      type: String,
      required: [true, "Арлын дугаарын үсгийг оруулна уу!"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Truck", truckSchema);
