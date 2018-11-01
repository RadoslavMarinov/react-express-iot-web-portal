const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

const server = require("http").Server(app);
const io = require("socket.io")(server);

const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// SOCKET
io.on("connection", function(socket) {
  console.log("Client connected", socket.client.id);
  socket.emit("greeting", { Hello: 1 });
});

// API calls
app.get("/api/hello", (req, res) => {
  res.send('{"riko":"sonq"}\r\nJSON');
});

// app.get("*", (req, res) => {
//   console.log(req.url);
//   res.send('{"riko":"sonq"}\r\nJSON');
// });

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
