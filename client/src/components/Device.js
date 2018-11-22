import React, { Component } from "react";
import { StDevCont } from "../components/styled/DevCont";

class Device extends Component {
  constructor(props) {
    super(props); //device
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <StDevCont>
          <p>Hello from device {this.props.device.devClass}</p>
        </StDevCont>
      </React.Fragment>
    );
  }
}

export default Device;
