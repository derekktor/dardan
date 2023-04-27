const mongoose = require("mongoose");

const truckSchema = mongoose.Schema(
  {
    truck_num: {
      digits: {
        type: String,
        required: [true, "Арлын дугаарын тоог оруулна уу!"],
      },
      letters: {
        type: String,
        required: [true, "Арлын дугаарын үсгийг оруулна уу!"],
      }, 
    },
    load_name: {
      type: String,
    },
    load_weight: {
      type: Number
    },
    date_left: {
      type: Date
    },
    tavtsan_ashiglalt: {
      type: String
    },
    puulelt: {
      type: Boolean
    },
    hour_forklift_used: {
      type: String
    },
    crane_usage: {
      type: Number
    },
    fine1: {
      type: Boolean
    },
    fine2: {
      type: Boolean
    },
    other1: {
      type: Boolean
    },
    other2: {
      type: Boolean
    },
    invoice_to_302: {
      type: Number
    },
    invoice_to_601: {
      type: Number
    },
    amount_w_noat: {
      type: Number
    },
    amount_wo_noat: {
      type: Number
    },
    client_name: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Truck", truckSchema);
