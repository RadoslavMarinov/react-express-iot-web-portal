import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class AddNewDevice extends Component {
  constructor(props) {
    super(props);
    this.state = { deviceId: "", redirUser: false };
  }

  setRedirectUser = () => {
    this.setState({ redirUser: true });
  };
  renderUser = () => {
    if (this.state.redirUser) {
      return <Redirect to="/User" />;
    }
  };

  async componentWillMount() {
    var res = await fetch("user/isLoggedIn", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    try {
      res = await res.json();
    } catch (error) {
      // throw new Error(" ERROR **** response is not JSON format!");
    }
    if (res.status === "ok") {
      console.log("LOGEDDDD");
    } else {
      console.log("NOT LOGGED");
    }
  }

  handleDevIdInput = e => {
    this.setState({ deviceId: e.target.value });
  };

  post = async () => {
    var res = await fetch("user/registerDevice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId: this.state.deviceId })
    });
    try {
      res = await res.json();
    } catch (error) {
      // throw new Error(" ERROR **** response is not JSON format!");
    }
    if (res.status === "ok") {
      console.log("LOGEDDDD");
    } else {
      console.log("NOT LOGGED");
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.renderUser()}
        <h1>Add new Device</h1>
        {/*eslint-disable */}
        <a style={{ float: "right" }} href="" onClick={this.setRedirectUser}>
          User page
        </a>
        {/*eslint-enable */}
        <input
          name="deviceId"
          placeholder="Paset Device ID here"
          onChange={this.handleDevIdInput}
          value={this.state.deviceId}
        />
        <button onClick={this.post}>SAVE</button>
      </React.Fragment>
    );
  }
}

export default AddNewDevice;
