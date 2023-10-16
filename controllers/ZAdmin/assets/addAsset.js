const { Assets } = require("@models");
const createId = require("@utils/createId");
const Messages = require("@utils/messages");

//check if Asset exists
//check if coin pair exists in binance
//create a Asset
const addAsset = async (req, res, next) => {
  const { assetName, coinPair, amount } = req.body;
  const assetId = createId();
  await Assets.create({
    assetId,
    assetName,
    coinPair,
    amount,
  });
  return res.status(200).json({
    message: Messages.requestSuccessful,
  });
};

module.exports = addAsset;
