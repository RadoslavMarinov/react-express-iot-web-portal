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
            name={ep.name}
            displayName={ep.displayName}
            level={ep.state}
            onStateChange={this.props.onStateChange}
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
