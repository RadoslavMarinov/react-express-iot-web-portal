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

  deleteDeviceById(devId, reason) {
    try {
      clearTimeout(this.devs[devId].updateTimeout);
      console.log(
        `Device ${devId} has been deleted due to ${
          reason ? reason : "undefined reaason"
        }`.grey
      );
      this.devs[devId] = null;
    } catch (error) {
      console.log(`device is already deleted. Error: ${error}`.red);
    }
  }

  update(device, req, res) {
    var dev = device;

    dev = this.devs[device.id] = dev;
    dev.res = res;

    if (dev.updateTimeout) {
      throw new Error("Ovewriting device timeout");
    }
    dev.updateTimeout = setTimeout(() => {
      console.log("UPDATE TIME".magenta);
      res.end("upd\r\n");
    }, UPDATE_TIMEOUT_MS);

    dev.res.socket.on("timeout", () => {
      console.log(`Device: ${dev.id} socket timeout`);
    });

    dev.res.socket.on("close", reason => {
      console.log(
        `Device: ${dev.id} socket closed ${
          reason ? "reason: " + reason : ""
        } reason ${reason}`
      );
      this.deleteDeviceById(device.id, "socket closed");
    });

    console.log(`THIS DEVICE IS : ${this.devs[device.id]}`.green);
    dev.res.write("ack\r\n");
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
    if (typeof this.devs[id] === "undefined") {
      console.log(`Device with id ${id}, not available`.red);
      return null;
    } else {
      return this.devs[id];
    }
  }

  deviceNumber(print) {
    var i = 0;
    for (let dev in this.devs) {
      if (print) {
        // console.log(this.devs[dev]);
      }
      ++i;
    }
    return i;
  }
}

const devices = new Devices();

module.exports = {
  devices: devices
};
