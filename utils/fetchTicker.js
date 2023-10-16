const { coinLabelMap } = require("@config");
const axios = require("axios");

const fetchTickerData = async (assetName) => {
  const tradingPair = coinLabelMap[assetName];
  if (!tradingPair) {
    throw new Error(Messages.invalidAsset);
  }
  const url = `https://api.binance.com/api/v3/ticker/24hr?symbol=${tradingPair}`;
  try {
    const response = await axios.get(url);
    const data = response.data;
    let lastPrice = parseFloat(data.lastPrice).toFixed(2);
    let priceChange = parseFloat(data.priceChange).toFixed(2);
    return {
      lastPrice,
      priceChange,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = fetchTickerData;
