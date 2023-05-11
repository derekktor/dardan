const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    created_by_name: {
      type: String,
    },
    date_entered: {
      type: Date, // 04/12/2022
    },
    truck_id: {
      digits: {
        type: String,
        // required: [true, "Арлын дугаарын тоог оруулна уу!"],
      },
      letters: {
        type: String,
        // required: [true, "Арлын дугаарын үсгийг оруулна уу!"],
      },
    },
    load_name: {
      type: String,
    },
    load_weight: {
      type: Number,
    },
    date_left: {
      type: Date, // 04/20/2022
    },
    tavtsan_ashiglalt: {
      type: String, // gadna_tavtsan || aguulah_tavtsan
    },
    puulelt: {
      type: Boolean,
    },
    forklift_usage: {
      type: String, // once || [0-9]
    },
    crane_usage: {
      type: Number, // 0 - ashiglaagui || 1 - hooson orgolt, 100k || 2 - achaatai orgolt, 250k
    },
    fine1: {
      type: Boolean, 
    },
    fine2: {
      type: Boolean,
    },
    other1: {
      type: Boolean,
    },
    other2: {
      type: Boolean,
    },
    invoice_to_302: {
      type: Number,
    },
    invoice_to_601: {
      type: Number,
    },
    amount_w_noat: {
      type: Number,
    },
    amount_wo_noat: {
      type: Number,
    },
    client_name: {
      type: String,
    },
    stage: {
      type: Number // 0 || 1 || 2 - done
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
