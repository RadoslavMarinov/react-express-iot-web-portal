import React, { Component } from "react";
import { StDevsCont } from "../components/styled/DevsCont";
import Device from "./Device";

class Devices extends Component {
  constructor(props) {
    super(props);
    this.state = { devs: [] };
  }

  populateDevices = devices => {
    return devices.map((dev, idx) => {
      return <Device key={idx.toString()} device={dev} />;
    });
  };

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    this.setState({ devs: nextProps.devs });
  }

  render() {
    return <StDevsCont>{this.populateDevices(this.state.devs)}</StDevsCont>;
  }
}

export default Devices;
