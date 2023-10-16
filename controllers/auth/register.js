const crypto = require("crypto");
const id = crypto.randomBytes(6).toString("hex");
const User = require("@models/users");
const bcrypt = require("bcrypt");
const Messages = require("@utils/messages");

const Register = async (req, res) => {
  const {
    username,
    email,
    referrer,
    phone,
    password: plainPassword,
  } = req.body;

  const getUser = await User.findOne({ username });
  const getPhone = await User.findOne({ phone });
  const getEmail = await User.findOne({ email });
  if (getUser) {
    return res.status(400).json({ message: Messages.invalidUsername });
  }
  if (getEmail) {
    return res.status(400).json({ message: Messages.invalidEmail });
  }
  if (getPhone) {
    return res.status(400).json({ message: Messages.invalidPhoneNumber });
  }
  const password = await bcrypt.hash(plainPassword, 10);
  await User.create({
    userId: id,
    username,
    email,
    phone,
    referrer,
    password,
    authMethod: "local",
  });
  //redirect to login page with message
  const message = Messages.userCreatedSuccessfully;
  return res.redirect(
    301,
    `${process.env.CLIENT_URL}/login?message=${encodeURIComponent(message)}`
  );
  // return res.status(200).json({ message: Messages.userCreatedSuccessfully });
};

module.exports = { Register };
