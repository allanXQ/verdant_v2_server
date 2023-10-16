const router = require("express").Router();
const formValidate = require("../../middleware/validate");
const { verifyjwt } = require("../../middleware/verifyjwt");
const {
  UpdatePassword,
  Login,
  Register,
  ResetPassword,
  ForgotPassword,
  RefreshToken,
  Logout,
  googleOAuth,
} = require("../../controllers/user/index");
const {
  regSchema,
  loginSchema,
  updatePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  userInfoSchema,
} = require("../../yupschemas");

const errorHOC = require("../../utils/errorHOC");
const { isLoggedIn } = require("../../controllers/auth/isLoggedIn");

// routes
router.post("/register", formValidate(regSchema), errorHOC(Register));
router.post("/login", formValidate(loginSchema), errorHOC(Login));
router.post(
  "/reset-password/:id/:token",
  formValidate(resetPasswordSchema),
  errorHOC(ResetPassword)
);
router.get("/verify", verifyjwt, errorHOC(isLoggedIn));
router.post("/refresh-token", errorHOC(RefreshToken));
router.post("/logout", formValidate(userInfoSchema), errorHOC(Logout));

router.post(
  "/forgot-password",
  formValidate(forgotPasswordSchema),
  errorHOC(ForgotPassword)
);
router.post(
  "/update-password",
  verifyjwt,
  formValidate(updatePasswordSchema),
  errorHOC(UpdatePassword)
);

router.get("/google", googleOAuth);

module.exports = router;
