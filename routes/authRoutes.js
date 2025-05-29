const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require("../controller/AuthController");
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validator");
const { authValidators } = require("../utils/validators");

router.post("/login", authValidators.login, validate, loginUser);
router.post(
  "/register-admin",
  [authValidators.register, validate],
  registerUser
);
router.post("/logout/:id", [protect], logoutUser);

module.exports = router;
