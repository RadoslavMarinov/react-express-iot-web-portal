"use strict";

const colors = require("colors");
const Device = require(`./device`).Device;
const db = require("./db/mongo");

class Devices {
  constructor() {
    this.devs = {};
    this.resolver = new Function();
    this.resolver = this.resolver.bind(this);

    setInterval(() => {
      this.printDeviceInfo(true);
    }, 1000);
  }

  /******************** UPDATE DEVICE *****************************/

  update(device, req, res) {
    if (!this.devs[device.id]) {
      db.findOne("users", {
        "devices.id": device.id
      }).then(result => {
        console.log(`${result}`.blue);
        if (result) {
          this.devs[device.id] = new Device(device.id, device, res);
          this.devs[device.id].update(device, res);
          console.log(`New device ID: ${device.id}`.blue);
          res.write("ack\r\n");
        } else {
          res.send("halt\r\n");
          console.log(`Unregistered device ID: ${device.id}`.red);
        }
      });
    } else {
      this.devs[device.id].update(device, res);
      res.write("ack\r\n");
    }
    // var dev = device;
  }

  /*********************** HELPERS ********************/

  handlePendingTasks(reqDev) {
    // console.log(`${JSON.stringify(reqDev)}`);
    var device = this.getDeviceById(reqDev.id);
    if (device) {
      if (device.timeout) {
        clearTimeout(device.timeout);
      }
      if (device.resolve) {
        device.resolve(reqDev);
        console.log(`DEvice resolve`.rainbow);
      }
    }
  }

  deleteDeviceById(devId, reason, assignAfterDeletion) {
    try {
      clearTimeout(this.devs[devId].updateTimeout);
      console.log(
        `Device ${devId} has been deleted due to ${
          reason ? reason : "undefined reaason"
        }`.grey
      );
      this.devs[devId] = {};
      if (assignAfterDeletion) {
        var keys = Object.keys(assignAfterDeletion);
        keys.map(key => {
          this.devs[devId][key] = assignAfterDeletion[key];
        });
        console.log(
          `Device ${devId} after deletion is ${this.devs[devId]}`.blue
        );
      }
    } catch (error) {
      console.log(`device is already deleted. Error: ${error}`.red);
    }
  }

  exists(dev) {
    if (typeof dev.id === "undefined") {
      return false;
    } else {
      return true;
    }
  }

  waitSocketClose(resolver = this.resolver) {
    return new Promise((resolve, reject) => {
      resolver = resolve;
    });
  }

  getDeviceById(id) {
    if (this.devs[id]) {
      return this.devs[id];
    } else {
      console.log(`Device with id ${id}, not available`.red);
      return null;
    }
  }

  printDeviceInfo(print) {
    var i = 0;
    for (let dev in this.devs) {
      var device = this.devs[dev];
      if (print) {
        // console.log(this.devs[dev]);
      }
      if (this.devs[dev] !== null && this.devs[dev]) {
        if (print) {
          console.log(`${device.id}, State: ${device.state}`);
        }
      }
    }
  }
}

const devices = new Devices();

module.exports = {
  devices: devices
};
