const Assets = require("@models");
const mongoose = require("mongoose");
const crypto = require("crypto");
const id = () => crypto.randomBytes(6).toString("hex");

const assets = [
  {
    assetId: id(),
    assetName: "verdant",
    symbol: "VDT",
    coinPair: "ETHUSDT",
    amount: 100,
  },
  {
    assetId: id(),
    assetName: "azureCorp",
    symbol: "AZC",
    coinPair: "BTCUSDT",
    amount: 100,
  },
  {
    assetId: id(),
    assetName: "sapphireHoldings",
    symbol: "SPH",
    coinPair: "BNBUSDT",
    amount: 100,
  },
  {
    assetId: id(),
    assetName: "crimsonEnterprise",
    symbol: "CSE",
    coinPair: "ADAUSDT",
    amount: 100,
  },
  {
    assetId: id(),
    assetName: "goldenVentures",
    symbol: "GVT",
    coinPair: "XAUUSDT",
    amount: 100,
  },
  {
    assetId: id(),
    assetName: "silverSolutions",
    symbol: "SSN",
    coinPair: "XAGUSDT",
    amount: 100,
  },
  {
    assetId: id(),
    assetName: "emeraldInc",
    symbol: "EMI",
    coinPair: "DOTUSDT",
    amount: 100,
  },
  {
    assetId: id(),
    assetName: "rubyLtd",
    symbol: "RBL",
    coinPair: "LTCUSDT",
    amount: 100,
  },
  {
    assetId: id(),
    assetName: "topazGroup",
    symbol: "TPZ",
    coinPair: "LINKUSDT",
    amount: 100,
  },
  {
    assetId: id(),
    assetName: "amberAssociation",
    symbol: "AMA",
    coinPair: "XRPUSDT",
    amount: 100,
  },
];

const createAssets = async () => {
  try {
    await Assets.create(assets);
    console.log("Assets created successfully");
  } catch (error) {
    console.log(error);
  }
};
