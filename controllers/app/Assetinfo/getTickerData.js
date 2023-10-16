const { findQuery } = require("@services");
const Messages = require("@utils/messages");
const { klineIntervals, coinLabelMap } = require("@config");
const { Assets } = require("@models");
const { default: axios } = require("axios");

const getTickerData = async (req, res, next) => {
  const { assetName } = req.body;
  const tradingPair = coinLabelMap[assetName];
  if (!tradingPair) {
    throw new Error(Messages.invalidAsset);
  }
  const url = `https://api.binance.com/api/v3/ticker/24hr?symbol=${tradingPair}`;
  let tickerData = {};
  try {
    const response = await axios.get(url);
    const data = response.data;
    tickerData.high = parseFloat(data.highPrice).toFixed(2);
    tickerData.low = parseFloat(data.lowPrice).toFixed(2);
    tickerData.volume = parseFloat(data.volume).toFixed(2);
    tickerData.priceChange = parseFloat(data.priceChange).toFixed(2);
    tickerData.lastPrice = parseFloat(data.lastPrice).toFixed(2);
    return res.status(200).json({
      message: Messages.requestSuccessful,
      payload: {
        ...tickerData,
      },
    });
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = getTickerData;
