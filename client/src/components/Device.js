import React, { Component } from "react";
import { StDevCont } from "../components/styled/DevCont";
import Endpoint from "./Endpoint";

class Device extends Component {
  constructor(props) {
    super(props); //device
    this.state = { eps: this.props.device.endpoints };
  }

  popEps() {
    return this.props.device.endpoints.map((ep, idx) => {
      console.log(`Eps names : ${ep.name}`);
      return <Endpoint dev={this.props.device} ep={ep} />;
    });
  }

  componentDidMount() {}

  render() {
    return (
      <React.Fragment>
        <StDevCont>
          <p>{this.props.device.displayName}</p>
          <div>{this.popEps()}</div>
        </StDevCont>
      </React.Fragment>
    );
  }
}

export default Device;
