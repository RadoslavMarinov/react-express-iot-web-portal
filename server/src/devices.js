class Devices {
  constructor() {
    this.devs = {};
    this.resolver = new Function();
    this.resolver = this.resolver.bind(this);
  }

  add(dev) {
    // var counter = 0;
    // setInterval(() => {
    //   console.log(++counter + ` seconds`);
    // }, 1000);

    if (typeof this.devs[dev.id] === "undefined") {
      console.log(`New Device with ID: ${dev.id} has been added`);
    } else {
      clearTimeout(this.devs[dev.id].connTimer);
      console.log(`Device ${dev.id} Timeout timer cleared!`);
    }

    dev.connTimer = setTimeout(() => {
      var devId = this.devs[dev.id].id;
      delete this.devs[dev.id];
      console.log(`Device ${devId} is deleted!`);
    }, 55 * 1000);

    // REGISTE ON CLOSE EVENT LISTENER
    dev.res.on("timeout", () => {
      console.log("socket timeout");
      dev.res.socket.end();
    });

    setTimeout(() => {
      dev.res.write("upd\r\n");
      dev.res.end();
      dev.res.socket.end();
      console.log("ËND");
    }, 10 * 1000);

    this.devs[dev.id] = dev;

    // dev.res.on("close", () => {
    //   console.log("Connection for: " + dev.id + ", was closed");
    //   delete this.devs[dev.id];
    //   this.resolver();
    // });

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
