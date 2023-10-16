const { peerOrders } = require("@models");
const Messages = require("@utils/messages");

const getP2PTrades = async (req, res) => {
  const trades = await peerOrders.find({});

  res.status(200).json({
    message: Messages.requestSuccessful,
    payload: trades,
  });
};

module.exports = getP2PTrades;
