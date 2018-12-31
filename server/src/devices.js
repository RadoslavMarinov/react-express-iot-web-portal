class Devices {
  constructor() {
    this.devs = {};
    this.resolver = new Function();
    this.resolver = this.resolver.bind(this);

    setInterval(() => {
      console.log(this.deviceNumber());
    }, 1000);
  }

  deleteDeviceById(devId, reason) {
    try {
      delete this.devs[devId];
    } catch (error) {
      console.log("device is already deleted");
    }
    console.log(
      `Device ${devId} has been deleted due to ${
        reason ? reason : "undefined reaason"
      }`
    );
  }

  update(dev) {
    // In case the client attempts to send another request while socket is open
    if (typeof this.devs[dev.id] !== "undefined") {
      console.log("Device already exists");
      this.devs[dev.id].res.socket.end();
      return;
    }

    dev.res.socket.on("timeout", () => {
      console.log(`Device: ${dev.id} socket timeout`);
    });

    dev.res.socket.on("close", reason => {
      console.log(
        `Device: ${dev.id} socket closed ${
          reason ? "reason: " + reason : ""
        } reason ${reason}`
      );
      this.deleteDeviceById(dev.id, "socket closed");
    });

    setTimeout(() => {
      console.log("Update vreme doide");
      if (typeof this.devs[dev.id] === "undefined") {
        return;
      }
      dev.res.write("upd\r\n", () => {
        dev.res.end();
        console.log("END");
      });
    }, 5 * 1000);

    dev.res.on("finish", () => {
      console.log("Res Data has been sent", dev.res.socket);
    });
    dev.res.write("ack\r\n");

    this.devs[dev.id] = dev;
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
      return null;
    } else {
      return this.devs[id];
    }
  }

  deviceNumber() {
    var i = 0;
    for (let dev in this.devs) {
      ++i;
    }
    return i;
  }
}

const devices = new Devices();

module.exports = {
  devices: devices
};
