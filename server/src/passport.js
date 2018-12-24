// const express = require("express");
// const app = express();
var passport = require("passport");
var Strategy = require("passport-local").Strategy;
var { ensureLoggedIn } = require("connect-ensure-login");
var flash = require("connect-flash");

//// ============ PASSPORT SETUP ===============

passport.use(
  new Strategy(function(username, password, cb) {
    if (username !== "riko") {
      // console.log("Incorrect User");
      return cb(null, false, { message: "Icorrect user!" });
    }
    if (password !== "kote") {
      // console.log("Incorrect Password");
      return cb(null, false, { message: "Icorrect password!" });
    }
    return cb(
      null,
      {
        message: "Bravo riksan",
        username: "riko",
        passpord: "kote",
        chemer: "memer"
      },
      {}
    );
  })
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(user, cb) {
  if (user.username == "riko") {
    return cb(null, user);
  } else {
    return cb("Invalid user!");
  }
  // db.users.findById(id, function(err, user) {
  //   if (err) {
  //     return cb(err);
  //   }
  //   cb(null, user);
  // });
});

module.exports = {
  passport: passport,
  ensureLoggedIn: ensureLoggedIn
};
