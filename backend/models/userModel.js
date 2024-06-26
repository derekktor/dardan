const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      // required: [true, "Нэрээ оруулна уу?"],
      unique: true
    },
    password: {
      type: String,
      // required: [true, "Нууц үгээ оруулна уу?"],
    },
    roles: {
      type: Array,
      default: ["employee"]
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
