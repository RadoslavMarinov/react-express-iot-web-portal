"use strict";

const END_DEV_REQ_TO_MS = 5 * 1000;
const UPDATE_TIMEOUT_MS = 47 * 1000;

class Device {
  constructor(id, station, response) {
    this.stateOption = {
      online: 0,
      pending: 1,
      offline: 2
    };
    this.state = this.stateOption.offline;
    this.id = id;
    this.station = station; //Object that arives as req.body from end device
    this.response = response;
    this.updTimeout = null;
    this.endDeviceReqTimeout = null;
    // get station update
    this.waitDevReadyTO = null;
    this.resolveDevReady = null;
  }

  update(station, response) {
    this.station = station;
    this.response = response;
    this.state = this.stateOption.online;
    clearTimeout(this.endDeviceReqTimeout);
    clearTimeout(this.updTimeout);

    this.updTimeout = setTimeout(() => {
      console.log("UPDATE");
      this.response.end("upd\r\n");
      this.enterPendingState();
    }, UPDATE_TIMEOUT_MS);

    this.handlePendingActions();
  }

  async sendMessage(message) {
    try {
      if (typeof message !== "string") {
        throw "Message must be string/json";
      }
      await this.deviceReady();
      this.response.end(message + "\r\n");
      this.enterPendingState();
      return true;
    } catch (error) {
      console.log(`${error}`.red);
      throw error;
    }
  }

  async getStation() {
    try {
      await this.deviceReady();
      return this.station;
    } catch (error) {
      //  console.log(`${error}`);
      throw error;
    }
  }

  enterPendingState() {
    this.response = null;
    this.station = null;
    this.state = this.stateOption.pending;
    clearTimeout(this.updTimeout);
    this.endDeviceReqTimeout = setTimeout(() => {
      this.enterStateOffline();
    }, END_DEV_REQ_TO_MS);
  }

  enterStateOffline() {
    this.state = this.stateOption.offline;
    clearTimeout(this.endDeviceReqTimeout);
    clearTimeout(this.updTimeout);
  }

  deviceReady() {
    return new Promise((resolve, reject) => {
      switch (this.state) {
        case this.stateOption.offline: {
          reject("Device is offline or not available");
          break;
        }
        case this.stateOption.online: {
          resolve();
          break;
        }
        case this.stateOption.pending: {
          this.resolveDevReady = resolve;
          this.waitDevReadyTO = setTimeout(() => {
            reject("Device update timeout");
          }, END_DEV_REQ_TO_MS);
        }
      }
    });
  }

  handlePendingActions() {
    if (this.resolveDevReady) {
      clearTimeout(this.waitDevReadyTO);
      this.resolveDevReady();
    }
  }
}

module.exports = {
  Device: Device
};
