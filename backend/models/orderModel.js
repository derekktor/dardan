const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const orderSchema = mongoose.Schema(
  {
    created_by_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    created_by_name: {
      type: String,
    },
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
    date_entered: {
      type: Date
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
    forklift_usage: {
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

orderSchema.plugin(AutoIncrement, {
  inc_field: "ticket",
  id: "ticketNums",
  start_seq: 1
})

module.exports = mongoose.model("Truck", orderSchema);
