// ============ EXPRESS ===============
const express = require("express");
const session = require("express-session");
const app = express();
// ============ PASPORT ===============
var flash = require("connect-flash");
// var passport = require("passport");
// var Strategy = require("passport-local").Strategy;
// var { ensureLoggedIn } = require("connect-ensure-login");
// ============ DB ===============
const db = require("./server/src/db/mongo");
// ============ PROPRIETARY ===============
const utils = require("./server/src/utils");
const sessions = require("./server/src/sessions");
const { devices } = require("./server/src/devices");
const apiRoutes = require("./server/src/routes/api").routes;

// ============ OTHERS ===============
const colors = require("colors");
const server = require("http").Server(app);
const bodyParser = require("body-parser");
const path = require("path");
const { ensureLoggedIn, passport } = require("./server/src/passport");

// ============ MIDLEWARE SETUP ===============
app.use(bodyParser.json());
app.use(require("cookie-parser")());
app.use(require("morgan")("combined"));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({ secret: "keyboard cat", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//Routes
app.use("/api", apiRoutes);

//======================================================================
const port = process.env.PORT || 80;
const CONF_nodeEnv = "production";

db.findOne("devices", { id: "FA661234A5511" }).then(result => {
  console.log(result);
});

app.post("/api/user/get-data", async (req, res) => {
  var data = req.body;
  console.log("DATA", data);
  try {
    var dbUser = await db.findOne("users", { username: req.body.username });
  } catch (error) {
    res.send({ status: "Failed to find the user!" });
    throw new Error(error);
  }
  if (dbUser) {
    try {
      var session = await sessions.newSession(dbUser);
    } catch (error) {
      res.send({ status: "failed to update the session" });
    }
    // console.log("dbUser", dbUser);
    var response = {
      status: "OK",
      session: session,
      user: dbUser
    };
    console.log("Response", response);
    res.send(response);
  }
});

// ENDDEV *****************************************************************************
var counter = 0;

app.post("/enddev", (req, res) => {
  console.log("REQUEST TO ", req.route.path);
  console.log("Req Header ", req.headers);

  var dev = req.body;
  dev.res = res;
  devices.update(dev);
});
// ENDDEV *****************************************************************************

server.on("connection", socket => {
  socket.on("timeout", () => {
    // console.log("socket timeout");
    socket.end();
  });
  socket.on("error", err => {
    // console.log("Socket error: ", err);
  });
  socket.on("close", hadError => {
    // console.log(
    //   hadError
    //     ? "Socket closed due to ERROR during transmission"
    //     : "Socket closed"
    // );
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
// PRODUCNTION :::
if (process.env.NODE_ENV === "production" || CONF_nodeEnv === "production") {
  console.log("Node Env:", process.env.NODE_ENV);
  // Serve any static files
  // Handle React routing, return all requests to React app
  //
  app.get("/", ensureLoggedIn("/Home"), function(req, res) {
    // res.sendFile(path.join(__dirname, "client/build", "index.html"));

    res.redirect("/User");
  });
  app.get("/User", ensureLoggedIn(), function(req, res) {
    console.log(`User: ${JSON.stringify(req.user)}`);
    // res.sendFile(path.join(__dirname, "client/build", "index.html"));
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });

  app.post(
    "/Login",
    checkCred,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
      successFlash: "Bravo RIKO"
    }),
    (req, res) => {
      console.log("Redirected to User ".red);
      res.redirect("/User");
    }
  );

  function checkCred(req, res, next) {
    if (req.body.username === "riko" && req.body.password === "kote") {
      next();
    } else {
      res.send(
        JSON.stringify({ status: "error", message: "Invald creadentials" })
      );
    }
  }

  app.get("/Login", function(req, res) {
    console.log("Flash Error:".red, JSON.stringify(req.flash()));
    // console.log("Flash Error:".red, req.flash("message"));
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });

  app.get("/Logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}
