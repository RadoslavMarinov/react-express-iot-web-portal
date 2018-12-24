var express = require("express");
var routes = express.Router();
var utils = require("../utils");
var db = require("../db/mongo");

routes.post("/reg-data", async (req, res) => {
  try {
    dbDevice = req.body;
    dbDevice.devices = [];
    var device = await utils.validateRegReques(req.body);
    dbDevice.devices.push(device);
    await db.insertDoc("users", dbDevice);
    await db.removeDoc("devices", { id: req.body.deviceId });
    res.send(JSON.stringify({ status: "success", message: "" }));
    //-----------------
  } catch (error) {
    res.send(JSON.stringify({ status: "error", message: error }));
    console.log(error);
  }
});

module.exports = { routes: routes };
