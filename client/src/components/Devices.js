import React, { Component } from "react";
import { StDevsCont } from "../components/styled/DevsCont";
import Device from "./Device";

class Devices extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  populateDevices = devices => {
    return devices.map(dev => {
      return <Device device={dev} />;
    });
  };

  render() {
    return (
      <React.Fragment>
        <StDevsCont>{this.populateDevices(this.props.devs)}</StDevsCont>
      </React.Fragment>
    );
  }
}

export default Devices;
