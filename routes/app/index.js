const router = require("express").Router();
const { verifyjwt } = require("@middleware/verifyjwt");
const formValidate = require("@middleware/validate");
const { historicalKlinesSchema } = require("@yupschemas");
const errorHOC = require("@utils/errorHOC");
const {
  getAssets,
  getP2PTrades,
  getHistoricalKlines,
  getTickerData,
} = require("@controllers/app");

router.post("/ticker-data", errorHOC(getTickerData));
router.get("/p2p-trades", errorHOC(getP2PTrades));

router.post(
  "/historical-klines",
  verifyjwt,
  formValidate(historicalKlinesSchema),
  errorHOC(getHistoricalKlines)
);
router.get("/assets", errorHOC(getAssets));

module.exports = router;
