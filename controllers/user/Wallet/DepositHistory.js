const { MpesaDeposits } = require("@models");
const Messages = require("@utils/messages");

const MpesaDepositHistory = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: Messages.invalidRequest });
  }

  const depositHistory = await MpesaDeposits.find({ userId });
  return res
    .status(200)
    .json({ message: Messages.requestSuccessful, payload: depositHistory });
};

module.exports = { MpesaDepositHistory };
