const User = require("@models/users");
const Messages = require("@utils/messages");
const { clearTokens } = require("@utils/cookie");

const Logout = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findOneAndUpdate(
    { userId },
    {
      $set: { refreshToken: null },
    },
    { new: true }
  );
  if (!user) {
    clearTokens(res);
    return res.status(401).json({ message: Messages.invalidToken });
  }
  clearTokens(res);
  return res.status(200).json({ message: Messages.logOutSuccess });
};

module.exports = { Logout };
