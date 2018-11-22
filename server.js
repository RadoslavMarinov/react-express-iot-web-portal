const express = require("express");
const code = require("jwt-simple");
// const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

const server = require("http").Server(app);
const io = require("socket.io")(server);

const db = require("./server/src/db/mongo");
const utils = require("./server/src/utils");
const sessions = require("./server/src/sessions");

const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(
//   session({ secret: "rikotech-taina", resave: false, saveUninitialized: false })
// );

// SOCKET
io.on("connection", function(socket) {
  console.log("Client connected", socket.client.id);
  socket.emit("greeting", { Hello: 1 });
});
// Test

// API calls

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

app.post("/api/login/data", async (req, res) => {
  console.log(" POST : /api/login/data", req.body);
  var user;
  try {
    user = await db.findOne("users", {
      username: req.body.username,
      password: req.body.password
    });
  } catch (error) {
    console.log(error);
    res.send({ status: "Database Error!" });
  }

  if (user) {
    var resObj = {};

    console.log("User", user);

    resObj.status = "OK";
    resObj.session = sessions.newSession();
    resObj.user = user;

    console.log("RSPONSE OBJ", resObj);
    res.send(resObj);
  } else {
    res.send({ status: "User not found!" });
  }
});

app.post("/api/register/data", async (req, res) => {
  try {
    var isValid = await utils.validateRegReques(req.body);
    db.insertDoc("users", utils.constructUserObjectForDb(req.body))
      .then(result => {
        return db.removeDoc("devices", { deviceId: req.body.deviceId });
      })
      .then(async result => {
        console.log("User is added !");
        try {
          var user = await db.findMany("users", {
            username: req.body.username
          });
          userDevices = user[0].devices;
          console.log("USER IS ", userDevices);
          res.send(JSON.stringify({ devices: userDevices }));
        } catch {
          throw "User not findede";
        }
      })
      .catch(err => {
        throw err;
      });
  } catch (error) {
    res.send(JSON.stringify({ error: error }));
    console.log(error);
  }
});
//  Todo Check username and password if exist !
function dai(res) {
  var i = 1;
  setInterval(function() {
    res.write('{"riko":"sonq"}\r\nJSON' + i++);
  }, 2000);
}

app.post("/api/world", (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`
  );
});

// PRODUCNTION :::
if (process.env.NODE_ENV === "production") {
  console.log("Node Env:", process.env.NODE_ENV);
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));
  // Handle React routing, return all requests to React app
  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

server.on("connection", socket => {
  console.log("New connection");
  socket.on("data", data => {
    str = data.toString();
    io.emit("change", { data: str });
    var method = str.substr(0, str.indexOf(" "));
    // console.log(method);
    if (!(method === "GET" || method === "POST")) {
      console.log(data.toString());
    }
  });
});
server.on("clientError", (err, socket) => {
  console.log("ERROR");
  socket.removeAllListeners("error");
});

server.listen(port, () => console.log(`Listening on port ${port}`));
