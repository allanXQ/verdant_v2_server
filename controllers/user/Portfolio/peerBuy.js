const mongoose = require("mongoose");
const peerOrders = require("@models/p2p/peerOrders");
const peerEscrow = require("@models/p2p/peerEscrow");
const closedPeer = require("@models/p2p/closedPeer");
const User = require("@models/users");
const Messages = require("@utils/messages");
const logger = require("@utils/logger");
const createId = require("@utils/createId");

const peerBuy = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, assetName, orderType, amount, price } = req.body;
    if (orderType !== "buyp2p") {
      return res.status(400).json({ message: Messages.invalidRequest });
    }

    const Buyer = await User.findOne({ userId }).session(session);
    if (!Buyer) {
      return res.status(400).json({ message: Messages.invalidRequest });
    }
    const balance = parseInt(Buyer.accountBalance);
    const intAmount = parseInt(amount);
    const intPrice = parseInt(price);
    const assetValue = intAmount * intPrice;
    //check if user has enough balance
    if (balance < assetValue) {
      return res.status(400).json({ message: Messages.insufficientBalance });
    }
    //find if there is a matching sell order
    const sale = await peerOrders
      .findOne({
        assetName,
        price,
        amount,
        orderType: "sellp2p",
        userId: { $ne: userId },
      })
      .session(session);

    if (!sale) {
      //create a buy order
      const orderId = createId();
      await peerOrders.create(
        [
          {
            orderId,
            userId,
            assetName,
            amount,
            price,
            orderType: "buyp2p",
            totalAssetValue: assetValue,
          },
        ],
        { session }
      );
      //create an escrow
      await peerEscrow.create(
        [
          {
            orderId,
            userId,
            orderType: "buyp2p",
            cashAmount: assetValue,
          },
        ],
        { session }
      );
      //update user balance
      Buyer.accountBalance = balance - assetValue;
      await Buyer.save({ session });
      await session.commitTransaction();
      session.endSession();
      return res.status(200).json({ message: Messages.orderCompleted });
    }
    //update buyer balance and portfolio
    Buyer.accountBalance = balance - assetValue;
    const buyerportfolio = Buyer.portfolio;
    const buyerAsset = buyerportfolio.find(
      (item) => item.assetName === assetName
    );
    if (buyerAsset) {
      buyerAsset.amount += intAmount;
      await Buyer.save({ session });
    } else {
      buyerportfolio.push({
        ownerId: userId,
        assetName,
        amount: intAmount,
      });
    }
    Buyer.portfolio = buyerportfolio;
    await Buyer.save({ session });

    //update seller balance and portfolio
    const Seller = await User.findOne({ userId: sale.userId }).session(session);
    if (!Seller) {
      return res.status(400).json({ message: Messages.orderFailed });
    }
    Seller.accountBalance = parseInt(Seller.accountBalance) + assetValue;
    await Seller.save({ session });

    const sellerEscrow = await peerEscrow.findOne({
      orderId: sale.orderId,
    });
    if (!sellerEscrow) {
      return res.status(400).json({ message: Messages.orderFailed });
    }
    if (parseInt(sellerEscrow.amount) < intAmount) {
      return res
        .status(400)
        .json({ message: Messages.insufficientSellerASset });
    }

    await peerOrders.deleteOne({ orderId: sale.orderId }).session(session);
    await peerEscrow.deleteOne({ orderId: sale.orderId }).session(session);

    await closedPeer.create(
      [
        {
          orderId: sale.orderId,
          buyerId: userId,
          sellerId: sale.userId,
          assetName,
          amount,
          price,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({ message: Messages.orderCompleted });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error);
  }
};

module.exports = { peerBuy };
