import React, { Component } from "react";
import { StDevCont } from "../components/styled/DevCont";
import { SettingBtn } from "./styled/settBtn";
import { StlEpsContainter } from "./styled/StlEpsContainter";
import { StInfoBar } from "./styled/StInfoBar";

import Endpoint from "./Endpoint";

class Device extends Component {
  constructor(props) {
    super(props); //device
    this.state = {
      device: {},
      editBtn: "Edit",
      show: "eps",
      infoBar: { type: "info", msg: "" }
    };
  }

  // Pop Endpoints

  popEps() {
    if (this.state.device.endpoints) {
      return this.state.device.endpoints.map((ep, idx) => {
        return (
          <Endpoint
            key={idx.toString()}
            onStateChange={this.handleEpChange}
            ep={ep}
          />
        );
      });
    } else {
      return null;
    }
  }

  handleEpChange = async (target, data) => {
    console.log(`OnChnage from target: ${target}, with data: `);
    var command = { [data.key]: data.value };
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
      var newEps = this.state.device.endpoints.map((ep, idx) => {
        return { ...ep };
      });
      newEps = newEps.map(ep => {
        var found = resJson.data.endpoints.find(item => {
          return item.hasOwnProperty(ep.name);
        });
        ep.state = found[ep.name].state;
        return ep;
      });
      var newDev = { ...this.state.device };
      newDev.endpoints = newEps;
      this.setState(prevState => {
        return { device: newDev };
      });
      // Set message style:
      let newIB = { ...this.state.infoBar };
      newIB.type = "info";
      newIB.msg = "";
      this.setState({ infoBar: newIB });
    } else {
      let newIB = { ...this.state.infoBar };
      newIB.type = "error";
      newIB.msg = resJson.message;
      this.setState({ infoBar: newIB });
    }
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ device: nextProps.device });
  }
  componentDidMount() {
    this.setState({ device: this.props.device });
    console.log(this.props.device);
  }

  render() {
    return (
      <StDevCont>
        <p>{this.state.device.displayName}</p>
        <SettingBtn onClick={this.onClickEditSave}>
          {this.state.editBtn}
        </SettingBtn>
        {this.renderEpsContent(this.state.show)}
        <StInfoBar type={this.state.infoBar.type}>
          {this.state.infoBar.msg}
        </StInfoBar>
      </StDevCont>
    );
  }

  renderEpsContent(show) {
    switch (show) {
      case "eps": {
        return <StlEpsContainter>{this.popEps()}</StlEpsContainter>;
      }
      case "editEps": {
        return <div>{this.getEditFields()}</div>;
      }
      default: {
        throw new Error("Unhandled switch case in 'renderEpsContent'");
      }
    }
  }

  onClickEditSave = async () => {
    switch (this.state.editBtn) {
      // OnClick Edit button
      case "Edit": {
        this.setState({ show: "editEps", editBtn: "Save" });
        break;
      }
      // OnClick Save button
      case "Save": {
        console.log("Save");
        let result = await this.postChanges();
        if (result.status === "ok") {
          this.setState({
            // devDisplName: result.data.devDisplName,
            eps: result.data.endpoints
          });
        } else {
        }
        this.setState({ show: "eps", editBtn: "Edit" });
        break;
      }
      default: {
        throw new Error("Unhandled switch case");
      }
    }
  };

  // Posts the changed endpoint
  async postChanges() {
    // Apply values to endpoints
    // var newEps = this.state.eps.map(ep => {
    //   var newEp = { ...ep };
    //   newEp.displayName = this.state[newEp.name];
    //   return newEp;
    // });

    var res = await fetch("/user/devEdit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        device: this.state.device
      })
    });
    res = await res.json();
    console.log(res);
    return res;
  }
  // Returns array of input elemets corresponding to every endpoint
  getEditFields() {
    var inputs = [];
    // Device display name
    inputs.push(
      <input
        key={"devName"}
        owner={"device"}
        name={"diplayName"}
        type="text"
        onChange={this.onInpitChange}
        placeholder={"Device Name"}
        value={this.state.device.displayName}
      />
    );
    // Endpoints display name
    this.state.device.endpoints.map(ep => {
      inputs.push(
        <input
          key={ep.name}
          owner={"endpoint"}
          name={ep.name}
          type="text"
          onChange={this.onInpitChange}
          placeholder={ep.displayName}
          value={
            this.state.device.endpoints.find(
              endpoint => endpoint.name === ep.name
            ).displayName || ""
          }
        />
      );
      return 1;
    });
    return inputs;
  }
  //handles changes in input fields when editing endpoints
  onInpitChange = e => {
    var el = e.target;
    var owner = e.target.attributes.getNamedItem("owner").value;

    var newDev = JSON.parse(JSON.stringify(this.state.device));
    // var obj = el.name.split(".");
    switch (owner) {
      case "device": {
        newDev.displayName = el.value;
        break;
      }
      case "endpoint": {
        var ep = newDev.endpoints.find(ep => {
          return ep.name === el.name;
        });
        ep.displayName = el.value;
        break;
      }
      default: {
        this.setState({ [el.name]: el.value });
      }
    }
    this.setState({ device: newDev });
  };
}

export default Device;
