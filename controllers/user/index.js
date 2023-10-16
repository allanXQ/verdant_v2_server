//auth controllers
const { UpdatePassword } = require("../auth/updatepassword");
const { Login } = require("../auth/login");
const { Register } = require("../auth/register");
const { ResetPassword } = require("../auth/reset-password");
const { ForgotPassword } = require("../auth/forgot-password");
const { RefreshToken } = require("../auth/refreshjwt");
const { Logout } = require("../auth/logout");
const { googleOAuth } = require("../auth/googleOAuth");
const userInfo = require("../user/userInfo");

//wallet controllers
const { MpesaWithdraw } = require("./Wallet/MpesaWithdraw");
const { TinypesaWebhook } = require("./Wallet/TinypesaWebhook");
const { MpesaDeposit } = require("./Wallet/MpesaDeposit");
const { MpesaDepositHistory } = require("./Wallet/DepositHistory");
const { WithdrawalHistory } = require("./Wallet/WithdrawalHistory");

//portfolio controllers
const buyLimit = require("./Portfolio/buyLimit");
const sellLimit = require("./Portfolio/sellLimit");
const cancelOrder = require("./Portfolio/cancelOrder");
const { peerBuy } = require("./Portfolio/peerBuy");
const { peerSell } = require("./Portfolio/peerSell");
const tradeHistory = require("./Portfolio/tradeHistory");

module.exports = {
  UpdatePassword,
  Login,
  Register,
  ResetPassword,
  ForgotPassword,
  RefreshToken,
  Logout,
  googleOAuth,
  userInfo,

  MpesaWithdraw,
  TinypesaWebhook,
  MpesaDeposit,
  MpesaDepositHistory,
  WithdrawalHistory,

  buyLimit,
  cancelOrder,
  peerBuy,
  peerSell,
  sellLimit,
  buyLimit,
  tradeHistory,
};
