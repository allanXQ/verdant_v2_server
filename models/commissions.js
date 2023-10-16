const mongoose = require("mongoose");

const Commissions = new mongoose.Schema(
  {
    userId: { type: string, required: true },
    username: { type: String, required: true },
    phone: { type: Number, required: true },
    amount: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model("Commissions", Commissions);

module.exports = model;
