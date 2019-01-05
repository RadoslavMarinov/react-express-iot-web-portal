const colors = require("colors");

const UPDATE_TIMEOUT_MS = 5 * 1000;

class Devices {
  constructor() {
    this.devs = {};
    this.resolver = new Function();
    this.resolver = this.resolver.bind(this);

    setInterval(() => {
      console.log(this.deviceNumber(true));
    }, 1000);
  }

  /******************** UPDATE DEVICE *****************************/

  update(device, req, res) {
    // var dev = device;
    this.handlePendingTasks(device);

    this.devs[device.id] = {};

    this.devs[device.id].id = device.id;
    this.devs[device.id].reqBody = device;
    this.devs[device.id].res = res;

    if (this.devs[device.id].updateTimeout) {
      throw new Error("Ovewriting device timeout");
    }
    this.devs[device.id].updateTimeout = setTimeout(() => {
      console.log("UPDATE TIME".magenta);
      res.end("upd\r\n");
      this.deleteDeviceById(device.id, "Update timeout", null);
    }, UPDATE_TIMEOUT_MS);

    this.devs[device.id].res.socket.on("close", reason => {
      console.log(
        `Device: ${this.devs[device.id].id} socket closed ${
          reason ? "reason: " + reason : ""
        } reason ${reason}`
      );
      // this.deleteDeviceById(device.id, "socket closed");
    });

    this.devs[device.id].res.write("ack\r\n");
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

  deviceNumber(print) {
    var i = 0;
    for (let dev in this.devs) {
      if (print) {
        // console.log(this.devs[dev]);
      }
      if (this.devs[dev] !== null && this.devs[dev]) {
        ++i;
      }
    }
    return i;
  }
}

const devices = new Devices();

module.exports = {
  devices: devices
};
