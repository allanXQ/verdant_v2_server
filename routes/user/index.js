const router = require("express").Router();
const formValidate = require("../../middleware/validate");
const { verifyjwt } = require("../../middleware/verifyjwt");
const {
  userInfo,
  MpesaWithdraw,
  TinypesaWebhook,
  MpesaDeposit,
  MpesaDepositHistory,
  WithdrawalHistory,

  buyLimit,
  cancelOrder,
  tradeHistory,
  peerBuy,
  peerSell,
  sellLimit,
} = require("../../controllers/user/index");
const {
  depositSchema,
  withdrawalSchema,
  p2pOrderSchema,
  cancelOrderSchema,
  userInfoSchema,
  limitOrderSchema,
} = require("../../yupschemas");

const errorHOC = require("../../utils/errorHOC");

//wallet routes
router.post(
  "/transact/mpesa/deposit",
  verifyjwt,
  formValidate(depositSchema),
  errorHOC(MpesaDeposit)
);
router.post("/transact/tinypesa/webhook", errorHOC(TinypesaWebhook));
router.post(
  "/transact/withdraw",
  verifyjwt,
  formValidate(withdrawalSchema),
  errorHOC(MpesaWithdraw)
);

router.post(
  "/history/deposits",
  verifyjwt,
  formValidate(userInfoSchema),
  errorHOC(MpesaDepositHistory)
);
router.post(
  "/history/withdrawals",
  verifyjwt,
  formValidate(userInfoSchema),
  errorHOC(WithdrawalHistory)
);

//portfolio routes
router.get("/history/trade/:stockname", verifyjwt, errorHOC(tradeHistory)); //if param return all sells for that stock by user else return all sells by user

router.post(
  "/trade/p2p/buy",
  verifyjwt,
  formValidate(p2pOrderSchema),
  errorHOC(peerBuy)
);
router.post(
  "/trade/p2p/sell",
  verifyjwt,
  formValidate(p2pOrderSchema),
  errorHOC(peerSell)
);
router.post(
  "/trade/spot/sell-limit",
  verifyjwt,
  formValidate(limitOrderSchema),
  errorHOC(sellLimit)
);
router.post(
  "/trade/spot/buy-limit",
  verifyjwt,
  formValidate(limitOrderSchema),
  errorHOC(buyLimit)
);
router.post(
  "/trade/cancel-order",
  verifyjwt,
  formValidate(cancelOrderSchema),
  errorHOC(cancelOrder)
);

router.post(
  "/user-info",
  verifyjwt,
  formValidate(userInfoSchema),
  errorHOC(userInfo)
);

module.exports = router;
