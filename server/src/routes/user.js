var express = require("express");
var routes = express.Router();
var utils = require("../utils");
var db = require("../db/mongo");

routes.post("/ep", async (req, res) => {
  console.log(`Request to ${req.url}`);
  console.log(`Body: ${JSON.stringify(req.body)}`);
  var { devId } = req.body;
  var { msg } = req.body;
  console.log(`Device Id: ${devId}`, `Message: ${JSON.stringify(msg)}`);

  res.send({ status: "ok" });
});

module.exports = { routes: routes };
