const mongoose = require("mongoose");

const closedPeer = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    buyerId: { type: String, required: true },
    sellerId: { type: String, required: true },
    assetName: { type: String, required: true },
    amount: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model("closedPeer", closedPeer);

module.exports = model;
