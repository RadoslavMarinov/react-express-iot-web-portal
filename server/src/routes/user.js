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

  trySend(devices.getDeviceById(devId), msg)
    .then(device => {
      device.res.end();
      // ==
      return new Promise((resolve, reject) => {
        var updateTimeout = setTimeout(() => {
          reject({ status: "error", message: "Device unresponsive" });
        }, 4 * 1000);

        devices.deleteDeviceById(devId, "user request", {
          resolve: resolve,
          timeout: updateTimeout
        });
      });
      // res.send({ status: "ok" });
    })
    .then(result => {
      console.log(`Resolved: ${JSON.stringify(result)}`.blue);
      res.send({ status: "ok", data: result });
    })
    .catch(err => {
      console.log(`${JSON.stringify(err)}`.red);
      res.send({ status: "error", message: err });
    });
});

/* HELPERS */
function trySend(dev, msg) {
  return new Promise((resolve, reject) => {
    var interv, timeout;

    if (send(dev, msg)) {
      resolve(dev);
      return;
    } else {
      // Try several times
      interv = setInterval(() => {
        if (send(dev, msg)) {
          clearInterval(interv);
          clearTimeout(timeout);
          resolve(dev);
          return;
        }
      }, TRY_INTERVAL_MS);
      // If didnt work terminate trying
      timeout = setTimeout(() => {
        clearInterval(interv);
        clearTimeout(timeout);
        reject("Device unresponsive");
      }, 4 * 1000);
    }
  });
}

send = function(dev, msg) {
  if (dev) {
    try {
      dev.res.write(JSON.stringify(msg));
      return true;
    } catch (error) {
      throw new Error(`ERROR ******* ${error}`.red);
    }
  } else {
    return false;
  }
};
module.exports = { routes: routes };
