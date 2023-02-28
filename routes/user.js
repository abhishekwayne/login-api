const express = require("express");
const httpProxy = require("express-http-proxy");

const User = require("../controller/user");
const router = express.Router();

router.post("/login", User.login);
router.post("/resend-otp", User.login);
router.post("/verify", User.verify);
module.exports = router;
