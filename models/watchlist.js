const mongoose = require("mongoose");

const Watchlist = new mongoose.Schema({
  userId: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  status: { type: String, default: "cleared" },
});

mongoose.exports = mongoose.model("Watchlist", Watchlist);
