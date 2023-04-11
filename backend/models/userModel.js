const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Нэрээ оруулна уу?"],
    },
    password: {
      type: String,
      required: [true, "Нууц үгээ оруулна уу?"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
