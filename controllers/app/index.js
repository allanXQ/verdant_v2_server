const getAssets = require("./Assetinfo/getAssets");
const getHistoricalKlines = require("./Assetinfo/getHistoricalKlines");
const getTickerData = require("./Assetinfo/getTickerData");
const getP2PTrades = require("./trades/p2p/getP2PTrades");

module.exports = {
  getAssets,
  getHistoricalKlines,
  getTickerData,
  getP2PTrades,
};
