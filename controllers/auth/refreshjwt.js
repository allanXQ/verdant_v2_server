require("dotenv").config();
const jwt = require("jsonwebtoken");

const User = require("@models/users");
const Messages = require("@utils/messages");
const { generateTokens, setCookies } = require("@utils/cookie");

const RefreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({ message: Messages.invalidRefreshToken });
  }

  const FindJwt = User.findOne({ refreshToken });

  if (!FindJwt) {
    return res.status(401).json({ message: Messages.invalidRefreshToken });
  }
  try {
    const verify = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (!verify) {
      //check error
      return res.status(401).json({ message: Messages.invalidRefreshToken });
    }

    const tokens = generateTokens(verify);
    setCookies(res, tokens);

    const tokenUpdate = await User.updateOne(
      { refreshToken },
      { $set: { refreshToken: tokens.refreshToken } }
    );

    if (tokenUpdate.nModified === 0) {
      return res.status(401).json({ message: Messages.requestFailed });
    }
    return res.status(200).json({ message: Messages.tokenRefreshed });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      error.name = "RefreshTokenExpiredError";
      throw error;
    }
  }
};

module.exports = { RefreshToken };
