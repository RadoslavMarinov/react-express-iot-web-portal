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
      dev.res.on("close", () => {
        console.log("Connection for: " + dev.id + ", was closed");
        clearInterval(this.devs[dev.id].beacont);
        delete this.devs[dev.id];
        console.log(this.devs.length);
      });

      this.devs[dev.id].beacont = setInterval(() => {
        this.devs[dev.id].res.write("node alive");
      }, 52 * 1000);
    }
    console.log(this.devs.length);
    // dev.res.set("Content-Type", "text/plain");
    dev.res.write("Hi for first time!");
  }

  get devices() {
    return this.devs;
  }
}

const devices = new Devices();

module.exports = {
  devices: devices
};
