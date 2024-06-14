const mongoose = require("mongoose");
const { roles } = require("../config");

const Schema = mongoose.Schema;

// Portfolio sub-schema
const PortfolioSchema = new Schema({
  ownerId: { type: String, required: true },
  assetName: { type: String, required: true },
  amount: { type: Number, required: true },
});

// Referrals sub-schema
const ReferralSchema = new Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
});

// Users schema
const UserSchema = new Schema(
  {
    userId: { type: String },
    role: { type: String, default: roles.user },
    firstname: { type: String },
    lastname: { type: String },
    googleName: {
      type: String,
      required: function () {
        return this.authMethod !== "local";
      },
    },
    username: {
      type: String,
      required: function () {
        return this.authMethod === "local";
      },
    },
    email: { type: String, required: true, unique: true },
    phone: {
      type: String,
      required: function () {
        return this.authMethod === "local";
      },
    },
    accountBalance: { type: Number, default: 0 },
    authMethod: {
      type: String,
      enum: ["local", "google"],
      required: true,
    },
    status: { type: String, default: "Unverified" },
    referrer: { type: String, default: "none" },
    refreshToken: { type: String },
    passwordResetToken: { type: String },
    password: {
      type: String,
      required: function () {
        return this.authMethod === "local";
      },
    },
    portfolio: [PortfolioSchema],
    referrals: [ReferralSchema],
  },
  {
    timestamps: true,
  }
);

UserSchema.index(
  { username: 1 },
  { unique: true, partialFilterExpression: { username: { $ne: null } } }
);
UserSchema.index(
  { phone: 1 },
  { unique: true, partialFilterExpression: { phone: { $ne: null } } }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
