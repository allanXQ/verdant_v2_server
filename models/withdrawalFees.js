const mongoose = require("mongoose");

const withdrawal_fees = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    amount: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model("withdrawal_fees", withdrawal_fees);

module.exports = model;
