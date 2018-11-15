const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

const server = require("http").Server(app);
const io = require("socket.io")(server);

const db = require("./src/db/mongo");
const utils = require("./src/utils");

const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({ secret: "rikotech-taina", resave: false, saveUninitialized: false })
);

// SOCKET
io.on("connection", function(socket) {
  console.log("Client connected", socket.client.id);
  socket.emit("greeting", { Hello: 1 });
});
// Test

app.get("/api/aaa", function(req, res) {
  console.log("ROOT REQUEST");
  res.send("Hellllll");
});

// API calls
app.get("/api/hello", (req, res) => {
  res.write('{"riko":"sonq"}\r\nJSON');
  var str;
  dai(res);
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
    res.send(JSON.stringify({ error: err }));
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
server.listen(port, () => console.log(`Listening on port ${port}`));
