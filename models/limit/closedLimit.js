const mongoose = require("mongoose");

const closedLimit = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    buyerId: { type: String, required: true },
    sellerId: { type: String, required: true },
    assetName: { type: String, required: true },
    amount: { type: Number, required: true },
    price: { type: Number, required: true },
    totalAssetValue: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model("closedLimit", closedLimit);

module.exports = model;
