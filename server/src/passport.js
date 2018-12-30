// const express = require("express");
// const app = express();
const colors = require("colors");
var passport = require("passport");
var Strategy = require("passport-local").Strategy;
var { ensureLoggedIn } = require("connect-ensure-login");
var db = require("../src/db/mongo");
//// ============ PASSPORT SETUP ===============

passport.use(
  new Strategy(async function(username, password, cb) {
    try {
      var user = await db.findOne("users", { username: username });
    } catch (error) {
      return cb(error);
    }

    if (username !== user.username) {
      return cb(null, false, { message: "Icorrect user!" });
    }
    if (password !== user.password) {
      // console.log("Incorrect Password");
      return cb(null, false, { message: "Icorrect password!" });
    }
    return cb(null, user, { message: "user lorem ipsum" });
  })
);
// may be the cookie itself represents the serialized 2nd param in cb()
passport.serializeUser(function(user, cb) {
  cb(null, user.username);
});

passport.deserializeUser(async function(username, cb) {
  try {
    var user = await db.findOne("users", { username: username });
  } catch (error) {
    return cb(error);
  }

  if (username === user.username) {
    return cb(null, user);
  } else {
    return cb(`User with username: ${username}, doesn't exist in the database`);
  }
});

module.exports = {
  passport: passport,
  ensureLoggedIn: ensureLoggedIn
};
