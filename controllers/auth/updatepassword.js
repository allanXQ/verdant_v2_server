require("dotenv").config();
const User = require("@models/users");
const bcrypt = require("bcrypt");
const Messages = require("@utils/messages");

const UpdatePassword = async (req, res) => {
  const { userId, oldPassword, newPassword: plainPassword } = req.body;
  const getUser = await User.findOne({ userId });
  if (!getUser) {
    return res.status(400).json({ message: Messages.userNotFound });
  }
  const bcompare = await bcrypt.compare(oldPassword, getUser.password);
  if (!bcompare) {
    return res.status(400).json({ message: Messages.incorrectPassword });
  }
  hashedPassword = await bcrypt.hash(plainPassword, 10);
  const userUpdate = await User.updateOne(
    { userId },
    {
      $set: { password: hashedPassword },
    }
  );
  if (userUpdate.nModified === 0) {
    return res.status(400).json({ message: Messages.updateFailed });
  }
  res.status(200).json({ message: Messages.updateSuccess });
};

module.exports = { UpdatePassword };
