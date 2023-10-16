const mongoose = require("mongoose");
const crypto = require("crypto");

const limitOrders = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    userId: { type: String, required: true },
    assetName: { type: String, required: true },
    amount: { type: Number, required: true },
    totalAssetValue: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model("limitOrders", limitOrders);

module.exports = model;
