class Devices {
  constructor() {
    this.devs = {};
    this.resolver = new Function();
    this.resolver = this.resolver.bind(this);
  }

  deleteDevice(devId, reason) {
    clearTimeout(this.devs[devId].connTimer);
    clearTimeout(this.devs[devId].deleteDeviceTo);
    delete this.devs[devId];
    console.log(
      `Device ${devId} has been deleted due to ${
        reason ? reason : "undefined reaason"
      }`
    );
  }

  update(dev) {
    if (typeof this.devs[dev.id] === "undefined") {
      console.log(`New Device with ID: ${dev.id} has been added`);
    } else {
      clearTimeout(this.devs[dev.id].deleteDeviceTo);
      clearTimeout(this.devs[dev.id].connTimer);
    }

    dev.connTimer = setTimeout(() => {
      this.deleteDevice(dev.id, "connection timeout!");
    }, 55 * 1000);

    // REGISTE ON CLOSE EVENT LISTENER
    // dev.res.on("timeout", () => {
    //   console.log("socket timeout");
    //   dev.res.socket.end();
    // });

    setTimeout(() => {
      dev.res.write("upd\r\n", () => {
        dev.res.end();
        // dev.res.socket.end();
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

  getDevices() {
    return this.devs;
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
