class Devices {
  constructor() {
    this.devs = {};
  }

  add(dev) {
    if (typeof this.devs[dev.id] === "undefined") {
      this.devs[dev.id] = dev;
      // REGISTE ON CLOSE EVENT LISTENER

      dev.res.socket.setTimeout(10 * 1000);
      dev.res.on("timeout", () => {
        console.log("socket timeout");
        dev.res.socket.end();
      });

      setTimeout(() => {
        this.devs[dev.id].res.write("update\r\n");
      }, 8 * 1000);

      dev.res.on("close", () => {
        console.log("Connection for: " + dev.id + ", was closed");
        delete this.devs[dev.id];
      });
    } else {
      throw new Error("Cant add device that already exists!");
    }
    dev.res.write("ack\r\n");
  }

  exists(dev) {
    if (typeof dev.id === "undefined") {
      return false;
    } else {
      return true;
    }
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
