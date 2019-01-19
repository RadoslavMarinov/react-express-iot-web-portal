var express = require("express");
const colors = require("colors");
const { ensureLoggedIn } = require("../passport");
var routes = express.Router();
const TRY_INTERVAL_MS = 500;

var { devices } = require("../devices");
var utils = require("../utils");
var db = require("../db/mongo");

// ROUTE AT: /user/ep
/* Called when Endpoint state change and it sends post reques*/
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

/**ROUTE AT /user/devupd
 * Called when User page is loaded in order to update the state
 * of the devices
 */
routes.post("/devupd", async (req, res) => {
  var { username } = req.body;

  var dbUser = await db.findOne("users", { username: username });
  console.log(`dbUser: ${JSON.stringify(dbUser)}`.yellow);

  Promise.all(
    dbUser.devices.map(async (dev, index) => {
      var endDev = devices.getDeviceById(dev.id);
      if (endDev) {
        try {
          var station = await endDev.getStation();
          var merged = mergeEndponts(dev.endpoints, station.endpoints);
          dev.devices = merged;
          // console.log(`Merged: ${JSON.stringify(merged)}`.green);
          return dev;
        } catch (error) {
          console.log(`${error}`.red);
          // dev.error = "device unreachable";
          return dev;
          // res.send({ status: "error", messsage: error });
        }
      } else {
        // dev.error = "device not installed";
        return dev;
      }
    })
  )
    .then(devices => {
      console.log(`${JSON.stringify(devices)}`.red);
      res.send({ status: "ok", data: devices });
    })
    .catch(err => {
      res.send({ status: "error", message: err });
    });
});

/**
 *
 */
routes.post("/devEdit", async (req, res) => {
  // console.log(`${JSON.stringify(req.body)}`.green);

  var { device } = req.body;
  var devId = device.id;
  console.log(`Body ${JSON.stringify(req.body)}`.green);
  console.log(`Body ${devId}`.grey);

  // var dbUser = await db.findOne("users", {
  //   "devices.id": devId
  // });

  // var dbUser = await db.findOne("users", {
  //   devices: { $elemMatch: { id: devId } }
  // });

  // console.log(`User found: ${JSON.stringify(dbUser)}`.blue);
  // newEps = Object.assign(dbDevice.endpoints, endpoints);

  result = await db.updateField(
    "users",
    {
      "devices.id": devId
    },
    { $set: { "devices.$[devEl]": device } },
    { arrayFilters: [{ "devEl.id": devId }] }
  );
  console.log(`User found: ${JSON.stringify(result)}`.blue);
  // resa = await db.updateField(
  // "users",
  // {
  //   "devices.id": devId
  // },
  //   {
  //     $set: {
  //       "devices.$[devEl].endpoints.$[epEl].displayName": "EEADSASDASD"
  //     }
  //   },
  //   {
  //     arrayFilters: [
  //       { "devEl.id": "FA661234A511" },
  //       { "epEl.displayName": "sw1DisplName" }
  //     ]
  //   }
  // );

  var responseObj = {};
  if (result.ok === 1) {
    responseObj.status = "ok";
    if (result.nModified > 0) {
      responseObj.message = `{"modified: ${result.nModified}}`;
    } else {
      responseObj.message = `{"modified: 0"}`;
    }
    responseObj.data = { device: device };
  } else {
    responseObj.status = "error";
    responseObj.message = "DB Error";
    responseObj.data = { device: device };
  }
  res.send(responseObj);
});
// "/user/isLoggedIn"
routes.get("/isLoggedIn", ensureLoggedIn("/Home"), async (req, res) => {
  res.send({ status: "ok" });
});

routes.post("/registerDevice", ensureLoggedIn("/Home"), async (req, res) => {
  // res.send({ status: "ok" });
  // console.log(`${JSON.stringify(req.body)}`.red);
  try {
    var devId = req.body.deviceId;
    console.log(`Body ::: ${JSON.stringify(devId)}`.blue);

    var existsInUsers = await utils.dbExistDevice("users", devId);

    if (existsInUsers) {
      res.send({
        status: "error",
        message: "Device with this ID is already registerd"
      });
      return;
    }

    var devsDevice = await db.findOne("devices", {
      id: devId
    });

    if (!devsDevice) {
      res.send({
        status: "error",
        message: "Device with this ID doesn't exist"
      });
      return;
    }

    await utils.appendDevice(req.user.id, devsDevice);
    await db.removeDoc("devices", { id: devId });

    res.send({ status: "ok", message: "no message :)" });
    // dbDevice.devices = [];
    // var device = await utils.validateRegReques(req.body);
    // dbDevice.devices.push(device);

    // await db.insertDoc("users", dbDevice);
    // res.send(JSON.stringify({ status: "success", message: "" }));
    // //-----------------
  } catch (error) {
    res.send(JSON.stringify({ status: "error", message: error }));
    console.log(error);
  }
});

/* HELPERS */

/**
 */
function mergeEndponts(userDevEps, stationEps) {
  var mergedDevs = [];
  userDevEps.map(ep => {
    var epName = ep.name;
    // console.log(`user ep name: ${epName}`.green);
    // console.log(`station Endpoints: ${JSON.stringify(stationEps)}`.green);
    stationEp = stationEps.find(item => {
      return item.hasOwnProperty(epName);
    });
    // console.log(`station ep: ${stationEp}`.green);
    var merged = Object.assign(ep, stationEp[epName]);
    mergedDevs.push(merged);
  });
  return mergedDevs;
}

module.exports = { routes: routes };
