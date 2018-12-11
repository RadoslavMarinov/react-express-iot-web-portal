class Devices {
  constructor() {
    this.devs = {};
    setInterval(() => {
      var count = 0;
      for (var prop in this.devs) {
        count++;
      }
      console.log("Props count: " + count);
    }, 1500);
  }

  add(dev) {
    if (typeof this.devs[dev.id] === "undefined") {
      this.devs[dev.id] = dev;
      // REGISTE ON CLOSE EVENT LISTENER
      dev.res.on("close", () => {
        console.log("Connection for: " + dev.id + ", was closed");
        delete this.devs[dev.id];
      });

      dev.res.socket.on("data", data => console.log(data));
    } else {
      console.log("node alive: " + this.devs[dev.id].id);
      this.devs[dev.id].res.write("ack\r\n");
    }
    dev.res.write("ack\r\n");
  }

  get devices() {
    return this.devs;
  }
}

const devices = new Devices();

module.exports = {
  devices: devices
};
