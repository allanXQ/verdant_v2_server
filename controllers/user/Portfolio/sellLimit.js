const { default: mongoose } = require("mongoose");
const fetchTickerData = require("@utils/fetchTicker");
const Messages = require("@utils/messages");
const { User, limitOrders, limitEscrow } = require("@models");
const crypto = require("crypto");

const sellLimit = async (req, res) => {
  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();
    const { userId, assetName, amount } = req.body;
    const price = await fetchTickerData(assetName).lastPrice;

    //find seller and order
    const Seller = await User.findOne({ userId }).session(session);
    const Order = await limitOrders
      .findOne({ assetName, price, userId: { $ne: userId } })
      .session(session);

    const sellerPortfolio = Seller.portfolio;
    const saleAsset = sellerPortfolio.find(
      (asset) => asset.assetName === assetName
    );
    if (!saleAsset) {
      return res.status(400).json({ message: Messages.insufficientStocks });
    }
    const saleAssetAmount = parseInt(saleAsset.amount);
    const assetAmount = parseInt(amount);
    const totalAssetValue = assetAmount * price;

    if (saleAssetAmount < assetAmount) {
      return res.status(400).json({ message: Messages.insufficientStocks });
    }
    saleAsset.amount = saleAssetAmount - assetAmount;

    if (Order) {
      const buyerId = Order.userId;
      const orderId = Order.orderId;
      const Buyer = await User.findOne({ userId: buyerId }).session(session);
      const orderEscrow = await limitEscrow
        .findOne({ orderId })
        .session(session);
      const buyerPortfolio = parseInt(Buyer.portfolio);
      buyerPortfolio.find((asset) => {
        if (asset.assetName === assetName) {
          asset.amount = parseInt(asset.amount) + assetAmount;
        }
      });
      const escrowAmount = parseInt(orderEscrow.amount);
      let newEscrowAmount = escrowAmount - assetAmount;
      orderEscrow.amount = newEscrowAmount;
      if (newEscrowAmount <= 0) {
        await limitEscrow.deleteOne({ orderId }).session(session);
      }
      const newLimitOrderAmount = parseInt(Order.amount) - assetAmount;
      if (newLimitOrderAmount <= 0) {
        await limitOrders.deleteOne({ orderId }).session(session);
      } else {
        limitOrders.amount = newLimitOrderAmount;
      }
      Seller.accountBalance = parseInt(Seller.accountBalance) + totalAssetValue;
      await closedLimit.create(
        [
          {
            orderId,
            buyerId,
            sellerId: userId,
            assetName,
            price,
            amount,
            totalAssetValue,
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
          amount: amount,
          totalAssetValue,
        },
      ],
      { session }
    );

    await limitEscrow.create(
      [
        {
          orderId,
          orderType: "sell",
          userId,
          assetName,
          amount: amount,
        },
      ],
      { session }
    );

    await Seller.save();
    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({ message: Messages.orderCompleted });
  } catch (error) {
    session && (await session.abortTransaction());
    session && session.endSession();
    throw new Error(error);
  }
};

module.exports = sellLimit;
