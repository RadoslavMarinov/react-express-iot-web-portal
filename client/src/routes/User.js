import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
import Devices from "../components/Devices";

class User extends Component {
  constructor(props) {
    super(props);
    this.state = { devs: [] };
  }

  async componentDidMount() {
    var user = this.getUser(false);
    var { devices } = user;
    var res = await fetch("/user/devupd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(devices)
    });
    var resJson = await res.json();
    console.log(`${JSON.stringify(resJson)}`);
  }

  render() {
    // if (!this.state.user) {
    //   return this.redirectHome();
    // }
    return (
      <React.Fragment>
        <h1>{"waiting"}</h1>
        {/*eslint-disable */}
        <a href="" onClick={this.logout}>
          loguyt
        </a>
        {/*eslint-enable */}
        <Devices devs={this.getUser().devices} />
      </React.Fragment>
    );
  }

  updateState() {}

  logout(e) {
    console.log(e.target);
    e.preventDefault();
    localStorage.removeItem("user");
    fetch("/Logout", { method: "GET", redirect: "follow" })
      .then(res => {
        console.log("response status: " + res.status);
        window.location.assign(res.url);
      })
      .catch(err => {
        console.log("Error: " + err);
      });
  }

  getDeviceUpdateObject(dbUser) {
    var { devices } = dbUser;
    devices.map(dev => {});
  }

  getUser(tostring) {
    var user = localStorage.getItem("user");
    if (tostring) {
      return user;
    } else {
      return JSON.parse(user);
    }
  }
}

export default User;
