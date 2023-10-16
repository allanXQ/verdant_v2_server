const mongoose = require("mongoose");

//stores assetnames and amount for a sell order and cash amount for a buy order
const peerEscrow = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    orderType: { type: String, required: true },
    userId: { type: String, required: true },
    assetName: { type: String, default: "" },
    amount: { type: Number, default: 0 },
    cashAmount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model("peerEscrow", peerEscrow);

module.exports = model;
