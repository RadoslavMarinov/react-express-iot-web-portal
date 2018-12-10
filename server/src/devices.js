class Devices {
  constructor() {
    this.devs = [];
  }

  push(dev) {
    this.devs.push(dev);
  }

  get devices() {
    return this.devs;
  }
}

const devices = new Devices();

module.exports = {
  devices: devices
};
