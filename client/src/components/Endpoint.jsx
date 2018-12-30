import React, { Component } from "react";
import BinarySwitch from "./endpoints/BinarySwitch";

class Endpoint extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getEp(ep) {
    switch (ep.class) {
      case "binarySwitch": {
        return (
          <BinarySwitch
            dev={this.props.dev}
            name={ep.name}
            displayName={ep.displayName}
          />
        );
      }
      default: {
        return <p>{"Class not recognized"}</p>;
      }
    }
  }

  render() {
    return <div>{this.getEp(this.props.ep)}</div>;
  }
}

export default Endpoint;
