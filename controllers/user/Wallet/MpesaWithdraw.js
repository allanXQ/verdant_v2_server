const { default: mongoose } = require("mongoose");
const { WalletConfig } = require("@config");
const Messages = require("@utils/messages");
const { User } = require("@models");
const { Withdrawals } = require("@models");

//include withdrrawal fees
const MpesaWithdraw = async (req, res) => {
  let session;
  try {
    const { phone, amount } = req.body;
    const { withdrawalFeePercentage } = WalletConfig;

    let intAmount = parseInt(amount);

    // Validate amount before proceeding

    const taxAmount = intAmount * withdrawalFeePercentage;
    const totalAmount = intAmount + taxAmount;

    session = await mongoose.startSession();
    session.startTransaction();

    const updatedUser = await User.findOneAndUpdate(
      { phone },
      { $inc: { accountBalance: -totalAmount } },
      { session, new: true, returnOriginal: false }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: Messages.userNotFound });
    }

    const remainingBalance = parseInt(updatedUser.accountBalance) || 0;

    // Validate the remaining balance
    if (remainingBalance < 0) {
      return res.status(400).json({ message: Messages.insufficientBalance });
    }

    await Withdrawals.create(
      [
        {
          userId: updatedUser.userId,
          username: updatedUser.username,
          phone,
          amount: intAmount,
          mode: "mpesa",
        },
      ],
      { session }
    );

    const withdrawals = await Withdrawals.find({
      userId: updatedUser.userId,
    }).session(session);

    // const user = {
    //   ...updatedUser.toObject(),
    //   withdrawals,
    // };
    await session.commitTransaction();
    return res.status(200).json({
      message: Messages.withdrawalSuccess,
      // payload: {
      //   user,
      // },
    });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
  } finally {
    session.endSession();
  }
};

module.exports = { MpesaWithdraw };
