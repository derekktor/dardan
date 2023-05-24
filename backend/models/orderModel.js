const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    created_by: {
      type: String,
    },
    date_entered: {
      type: Date, 
    },
    truck_id_digits: {
      type: String,
    },
    truck_id_letters: {
      type: String,
    },
    load_name: {
      type: String,
    },
    load_weight: {
      type: Number,
    },
    date_left: {
      type: Date, 
    },
    tavtsan_usage: {
      type: String, // '0' || gadna_tavtsan || aguulah_tavtsan
    },
    puulelt: {
      type: Number, // 0 - hiilgeegui, 1 - suudliin mashin, 2 - busad
    },
    forklift_usage: {
      type: String, // 'neg' || [0-9]
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
    others: {
      type: Number, // 0 - bhgui, 1 - 7.1(crane, 20k), 2 - 7.2(busad, 10k)
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
    gaaliin_meduulgiin_dugaar: {
      type: String,
    },
    stage: {
      type: Number, // 0, 1 - done, 2 - only puulelt, 3 - others, 4 - puulelt done, 5 - others done
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
