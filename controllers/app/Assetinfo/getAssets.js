const Messages = require("@utils");
const { Assets } = require("@models");
const fetchTickerData = require("@utils/fetchTicker");

const getAssets = async (req, res) => {
  const assets = await Assets.find().lean();

  const promises = assets.map(async (asset) => {
    const { assetName } = asset;
    const { lastPrice, priceChange } = await fetchTickerData(assetName);
    asset.lastPrice = lastPrice;
    asset.priceChange = priceChange;
    return asset;
  });
  const newAssets = await Promise.all(promises);
  return res.status(200).json({
    message: Messages.requestSuccessful,
    payload: newAssets,
  });
};

module.exports = getAssets;
