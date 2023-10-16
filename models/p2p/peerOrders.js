const mongoose = require("mongoose");
const crypto = require("crypto");

const peerOrders = new mongoose.Schema(
  {
    orderId: {
      type: String,
      default: () => crypto.randomBytes(6).toString("hex"),
      unique: true,
    },
    userId: { type: String, required: true },
    assetName: { type: String, required: true },
    amount: { type: Number, required: true },
    price: { type: Number, required: true },
    orderType: { type: String, required: true, enum: ["buyp2p", "sellp2p"] },
    totalAssetValue: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model("peerOrders", peerOrders);

module.exports = model;
