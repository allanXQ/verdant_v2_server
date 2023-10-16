const mongoose = require("mongoose");

const MpesaDeposits = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    mpesaRef: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
    amount: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model("MpesaDeposits", MpesaDeposits);

module.exports = model;
