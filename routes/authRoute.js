const passport = require("passport");
const express = require("express");
const router = express.Router();
require("../services/passport");

router.route("/").get(
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.route("/callback").get(passport.authenticate("google"));

module.exports = router;
