const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const userController=require("../controllers/users");
const { log } = require("node:console");
// ----------------------
// SIGNUP FORM
// ----------------------
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

// ----------------------
// SIGNUP LOGIC
// ----------------------
router.post("/signup", userController.signup);

// ----------------------
// LOGIN FORM
// ----------------------
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

// ----------------------
// LOGIN LOGIC
// ----------------------
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login", // ✅ FIXED
    failureFlash: true,
  }),
 userController.renderLoginForm
);

// ----------------------
// LOGOUT
// ----------------------
router.get("/logout", userController.logout);

module.exports = router;