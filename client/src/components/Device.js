import React, { Component } from "react";
import { StDevCont } from "../components/styled/DevCont";
import { SettingBtn } from "./styled/settBtn";
import Endpoint from "./Endpoint";

class Device extends Component {
  constructor(props) {
    super(props); //device
    this.state = { eps: [], show: "eps", editBtn: "Edit" };
  }

  // Pop Endpoints

  popEps() {
    return this.state.eps.map((ep, idx) => {
      // console.log(`Eps names : ${ep.name}`);
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
          <SettingBtn onClick={this.onClickEditSave}>
            {this.state.editBtn}
          </SettingBtn>
          {this.renderEpsContent(this.state.show)}
        </StDevCont>
      </React.Fragment>
    );
  }

  renderEpsContent(show) {
    switch (show) {
      case "eps": {
        return <div>{this.popEps()}</div>;
      }
      case "editEps": {
        return <div>{this.getEditFields(this.state.eps)}</div>;
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
        let result = await this.postChanges();
        if (result.status === "ok") {
          this.setState({ eps: result.data.endpoints });
        } else {
          console.log(result);
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
    // Apply changes
    var newEps = this.state.eps.map(ep => {
      ep = { ...ep };
      ep.displayName = this.state[ep.name];
      return ep;
    });

    var res = await fetch("/user/devEdit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ devId: this.props.device.id, endpoints: newEps })
    });
    res = await res.json();
    return res;
  }
  // Returns array of input elemets corresponding to every endpoint
  getEditFields(endpoints) {
    // console.log(endpoints);
    var inputs = endpoints.map(ep => {
      return (
        <input
          key={ep.name}
          name={ep.name}
          type="text"
          onChange={this.onInpitChange}
          placeholder={ep.displayName}
          value={this.state[ep.name] ? this.state[ep.name] : ""}
        />
      );
    });
    return inputs;
  }
  //handles changes in input fields when editing endpoints
  onInpitChange = e => {
    var el = e.target;
    this.setState({ [el.name]: el.value });
  };
}

export default Device;
