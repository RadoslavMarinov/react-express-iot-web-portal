var express = require("express");
const colors = require("colors");

var routes = express.Router();
const TRY_INTERVAL_MS = 500;

var { devices } = require("../devices");
var utils = require("../utils");
var db = require("../db/mongo");

// ROUTE AT: /user/ep
routes.post("/ep", async (req, res) => {
  console.log(`Request to ${req.url}`);
  console.log(`Body: ${JSON.stringify(req.body)}`);
  var { devId } = req.body;
  var { msg } = req.body;
  console.log(`Device Id: ${devId}`, `Message: ${JSON.stringify(msg)}`);

  var device = devices.getDeviceById(devId);

  if (device) {
    device
      .sendMessage(JSON.stringify(msg))
      .then(value => {
        // console.log(value);
        return device.getStation();
      })
      .then(val => {
        res.send({ status: "ok", data: val });
      })
      .catch(err => {
        console.log(`${err}`.red);
        res.send({ status: "error", message: err });
      });
  } /* Device == null */ else {
    res.send({ status: "error", message: "Device not found" });
  }
});

/**ROUTE AT /user/devupd */
routes.post("/devupd", async (req, res) => {
  // console.log(`Request to ${req.url}`.yellow);
  // console.log(`Body: ${JSON.stringify(req.body)}`.yellow);

  var userDevices = req.body;

  userDevices.map(async (dev, index) => {
    // console.log(`User Device Endpoints: ${JSON.stringify(dev.endpoints)}`.blue);
    var endDev = devices.getDeviceById(dev.id);
    if (endDev) {
      try {
        var station = await endDev.getStation();
        mergeEndponts(dev.endpoints, station.endpoints);
        console.log(`${JSON.stringify(dev.endpoints)}`.green);
      } catch (error) {
        console.log(`${error}`.red);
      }
    } else {
    }
  });
});

/* HELPERS */

function mergeEndponts(userDevEps, stationEps) {
  userDevEps.map(ep => {
    var epName = ep.name;
    // console.log(`user ep name: ${epName}`.green);
    // console.log(`station Endpoints: ${JSON.stringify(stationEps)}`.green);
    stationEp = stationEps.find(item => {
      return item.hasOwnProperty(epName);
    });
    console.log(`station ep: ${stationEp}`.green);

    ep = Object.assign(ep, stationEp[epName]);
  });
}

module.exports = { routes: routes };
