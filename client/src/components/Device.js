import React, { Component } from "react";
import { StDevCont } from "../components/styled/DevCont";
import Endpoint from "./Endpoint";

class Device extends Component {
  constructor(props) {
    super(props); //device
    this.state = { eps: [] };
  }

  // Pop Endpoints

  popEps() {
    return this.state.eps.map((ep, idx) => {
      console.log(`Eps names : ${ep.name}`);
      return (
        <Endpoint
          key={idx.toString()}
          onStateChange={this.handleEpChange}
          ep={ep}
        />
      );
    });
  }

  handleEpChange = async (target, data) => {
    console.log(`OnChnage from target: ${target}, with data: `);
    var command = { [data.key]: data.value };
    console.log(command);
    // POST *********
    const res = await fetch("/user/ep", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ devId: this.props.device.id, msg: command })
    });
    const resJson = await res.json();
    console.log(resJson);
    // HANDLE RESPONE
    if (resJson.status === "ok") {
      var newEps = this.state.eps.map((ep, idx) => {
        return { ...ep };
      });
      newEps = newEps.map(ep => {
        var found = resJson.data.endpoints.find(item => {
          return item.hasOwnProperty(ep.name);
        });
        ep.state = found[ep.name].state;
        return ep;
      });
      this.setState({ eps: newEps });
    }
  };

  componentWillReceiveProps(nextProps) {
    console.log("Next props in DEVICE:");
    console.log(nextProps);
    this.setState({ eps: nextProps.device.endpoints });
  }
  componentDidMount() {
    this.setState({ eps: this.props.device.endpoints });
  }

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
