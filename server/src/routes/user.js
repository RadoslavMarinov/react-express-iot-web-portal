var express = require("express");
const colors = require("colors");

var routes = express.Router();
const TRY_INTERVAL_MS = 500;

var { devices } = require("../devices");
var utils = require("../utils");
var db = require("../db/mongo");

routes.post("/ep", async (req, res) => {
  console.log(`Request to ${req.url}`);
  console.log(`Body: ${JSON.stringify(req.body)}`);
  var { devId } = req.body;
  var { msg } = req.body;
  console.log(`Device Id: ${devId}`, `Message: ${JSON.stringify(msg)}`);

  trySend(devices.getDeviceById(devId), msg)
    .then(deviceResponse => {
      deviceResponse.end();
      // devices. deleteDeviceById(devId, `User terminates connection`);
      res.send({ status: "ok" });
    })
    .catch(err => {
      console.log(`${err}`.red);
      res.send({ status: "error" });
    });
});

function trySend(dev, msg) {
  return new Promise((resolve, reject) => {
    var interv, timeout;

    if (send(dev, msg)) {
      resolve(dev.res);
      return;
    } else {
      // Try several times
      interv = setInterval(() => {
        if (send(dev, msg)) {
          clearInterval(interv);
          clearTimeout(timeout);
          resolve(dev.res);
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
