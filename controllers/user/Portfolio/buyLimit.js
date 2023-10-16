const { default: mongoose } = require("mongoose");
const Messages = require("@utils/messages");
const { User, limitOrders, limitEscrow, closedLimit } = require("@models");
const axios = require("axios");
const { coinLabelMap } = require("@config");
const crypto = require("crypto");
const logger = require("@utils/logger");
const fetchTickerData = require("@utils/fetchTicker");

const buyLimit = async (req, res) => {
  let session;
  try {
    const { userId, assetName, amount } = req.body;
    const price = await fetchTickerData(assetName).lastPrice;
    session = await mongoose.startSession();
    session.startTransaction();

    //find buyer and order
    const Buyer = await User.findOne({ userId }).session(session);
    const Order = await limitOrders
      .findOne({ assetName, price, userId: { $ne: userId } })
      .session(session);
    const buyerBalance = parseInt(Buyer.accountBalance);
    const assetAmount = parseInt(amount);
    const totalCost = assetAmount * price;
    if (buyerBalance < totalCost) {
      return res.status(400).json({ message: Messages.insufficientBalance });
    }
    if (Order) {
      const sellerId = Order.userId;
      const orderId = Order.orderId;
      const Seller = await User.findOne({ userId: sellerId }).session(session);
      const orderEscrow = await limitEscrow
        .findOne({ orderId })
        .session(session);
      const sellerBalance = parseInt(Seller.accountBalance);
      const escrowAmount = parseInt(orderEscrow.amount);
      Buyer.accountBalance = buyerBalance - totalCost;
      Seller.accountBalance = sellerBalance + totalCost;
      const newEscrowAmount = escrowAmount - assetAmount;
      orderEscrow.amount = newEscrowAmount;
      if (newEscrowAmount <= 0) {
        await limitEscrow.deleteOne({ orderId }).session(session);
      }
      const buyerPortfolio = Buyer.portfolio;
      buyerPortfolio.find((asset) => {
        if (asset.assetName === assetName) {
          asset.amount = parseInt(asset.amount) + assetAmount;
        }
      });
      const newLimitOrderAmount = parseInt(Order.amount) - assetAmount;
      if (newLimitOrderAmount <= 0) {
        await limitOrders.deleteOne({ orderId }).session(session);
      } else {
        limitOrders.amount = newLimitOrderAmount;
      }
      await closedLimit.create(
        [
          {
            orderId,
            buyerId: userId,
            sellerId,
            assetName,
            price,
            amount,
            totalAssetValue: totalCost,
          },
        ],
        { session }
      );

      await Buyer.save();
      await Seller.save();
      await orderEscrow.save();
      await Order.save();
      await session.commitTransaction();
      session.endSession();
      return res.status(200).json({ message: Messages.orderCompleted });
    }
    const orderId = crypto.randomBytes(16).toString("hex");
    await limitOrders.create(
      [
        {
          orderId,
          userId,
          assetName,
          price,
          amount,
          totalAssetValue: totalCost,
        },
      ],
      { session }
    );
    await limitEscrow.create(
      [
        {
          orderId,
          orderType: "buyLimit",
          userId,
          assetName,
          cashAmount: totalCost,
        },
      ],
      { session }
    );
    Buyer.accountBalance = buyerBalance - totalCost;
    await Buyer.save();
    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({ message: Messages.orderCompleted });
  } catch (error) {
    session && (await session.abortTransaction());
    session && session.endSession();
    throw new Error(error);
  }
};

module.exports = buyLimit;
