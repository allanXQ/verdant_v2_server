const { Withdrawals } = require("@models");
const Messages = require("@utils/messages");

const WithdrawalHistory = async (req, res) => {
  const { userId } = req.body;
  const getWithdrawals = await Withdrawals.find({ userId });

  return res
    .status(200)
    .json({ message: Messages.requestSuccessful, payload: getWithdrawals });
};

module.exports = { WithdrawalHistory };
