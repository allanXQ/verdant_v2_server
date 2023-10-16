const { orderTypes } = require("@config");
const peerOrders = require("@models/p2p/peerOrders");
const peerEscrow = require("@models/p2p/peerEscrow");
const User = require("@models/users");
const Messages = require("@utils/messages");

const findMatchingOrder = async (orderId) => {
  const order = await peerOrders.findOne({ orderId });
  const escrow = await peerEscrow.findOne({ orderId });
  if (!order || !escrow) {
    return { order: null, escrow: null };
  }

  return { order, escrow };
};

const cancelOrder = async (req, res) => {
  const { userId, orderId, orderType } = req.body;
  switch (orderType) {
    case "buyp2p":
      const { order, escrow } = await findMatchingOrder(orderId);
      if (!order || !escrow) {
        return res.status(400).json({ message: Messages.invalidRequest });
      }

      const amount = parseInt(escrow.cashAmount);
      const Buyer = await User.findOneAndUpdate(
        {
          userId,
        },
        {
          $inc: {
            accountBalance: amount,
          },
        },
        { new: true }
      );
      if (!Buyer) {
        return res.status(400).json({ message: Messages.invalidRequest });
      }
      await peerOrders.deleteOne({ orderId });
      await peerEscrow.deleteOne({ orderId });
      return res.status(200).json({ message: Messages.requestSuccessful });
    case "sellp2p":
      //check if order exists
      //check escrow account
      //if sell update user portfolio
      //delete order and escrow
      const { order: sellOrder, escrow: sellEscrow } = await findMatchingOrder(
        orderId
      );
      if (!sellOrder || !sellEscrow) {
        return res.status(400).json({ message: Messages.invalidRequest });
      }
      const Seller = await User.findOne({ userId });
      if (!Seller) {
        return res.status(400).json({ message: Messages.invalidRequest });
      }
      const portfolio = Seller.portfolio;
      const asset = portfolio.find(
        (asset) => asset.assetName === sellOrder.assetName
      );
      if (!asset) {
        return res.status(400).json({ message: Messages.invalidRequest });
      }
      const amountToCredit = parseInt(sellEscrow.amount);
      asset.amount = parseInt(asset.amount) + amountToCredit;
      await Seller.save();
      await peerOrders.deleteOne({ orderId });
      await peerEscrow.deleteOne({ orderId });
      return res.status(200).json({ message: Messages.requestSuccessful });
  }
};

module.exports = cancelOrder;
