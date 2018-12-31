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
// ============ ROUTES ===============
const apiRoutes = require("./server/src/routes/api").routes;
const userRoutes = require("./server/src/routes/user").routes;

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
app.use("/user", userRoutes);

//======================================================================
const port = process.env.PORT || 80;
const CONF_nodeEnv = "production";
const SERVER_TIMOUT_MS = 20 * 1000;

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
  console.log("Req Body ", req.body);

  var dev = req.body;
  dev.res = res;
  devices.update(dev);
});
// ENDDEV *****************************************************************************

server.setTimeout(SERVER_TIMOUT_MS);

server.on("connection", socket => {
  socket.on("timeout", () => {
    console.log("server socket timeout");
    socket.end();
  });
  socket.on("error", err => {
    // console.log("Socket error: ", err);
  });
  // socket.on("close", hadError => {
  //   console.log(
  //     hadError
  //       ? "Socket closed due to ERROR during transmission"
  //       : "Socket closed"
  //   );
  // });
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
    console.log("Redirect to user:".red, req.user.green);
    console.log(req.session.red);
    res.redirect("/User");
  });
  app.get("/User", ensureLoggedIn(), function(req, res) {
    console.log(`User: ${JSON.stringify(req.user)}`);
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });

  app.post(
    "/Login",
    checkCred,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
      successFlash: true
    }),
    (req, res) => {
      console.log("".red);
      res.send(
        JSON.stringify({
          status: "ok",
          message: "OK",
          redirect: "/User",
          user: req.user
        })
      );
      // res.redirect("/User");
    }
  );

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

async function checkCred(req, res, next) {
  let { username } = req.body;
  let { password } = req.body;
  try {
    var user = await db.findOne("users", { username: req.body.username });
  } catch (error) {
    res.send(
      JSON.stringify({ status: "error", message: "Data Base fetch failed!" })
    );
  }
  if (user) {
    if (username === user.username && password === user.password) {
      req.locals = {};
      req.locals.user = user;
      next();
    } else {
      console.log(`Password incorrect`.red);
      res.send(
        JSON.stringify({ status: "error", message: "Invald credentials" })
      );
    }
  } else {
    console.log(
      `User with username ${username} does not exist in DataBase`.red
    );
    res.send(
      JSON.stringify({ status: "error", message: "Invald credentials" })
    );
  }
}
