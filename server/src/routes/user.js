var express = require("express");
const colors = require("colors");

var routes = express.Router();
const TRY_CNT = 6;
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
    .then(result => {
      res.send({ status: "ok" });
    })
    .catch(err => {
      console.log(`${err}`.red);
      res.send({ status: "error" });
    });
});

function trySend(dev, msg) {
  return new Promise((resolve, reject) => {
    var cnt = TRY_CNT;
    var interv;

    if (send(dev, msg)) {
      resolve();
      return;
    } else {
      interv = setInterval(() => {
        if (send(dev, msg)) {
          clearInterval(interv);
          resolve();
          return;
        } else if (cnt <= 0) {
          reject("timout");
        } else {
          console.log(`Count: ${cnt}`);
          cnt--;
        }
      }, TRY_INTERVAL_MS);
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
