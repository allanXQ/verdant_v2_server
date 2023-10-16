const router = require("express").Router();
const addAsset = require("../../controllers/ZAdmin/assets/addAsset");
const { verifyjwt } = require("../../middleware/verifyjwt");
const formValidate = require("../../middleware/validate");
const { addAssetSchema } = require("../../yupschemas");
const errorHOC = require("../../utils/errorHOC");

router.post("/add-asset", formValidate(addAssetSchema), errorHOC(addAsset));

module.exports = router;
