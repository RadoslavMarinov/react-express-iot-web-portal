import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Devices from "../components/Devices";
import { StlAddDevBtn } from "../components/styled/StlAddDevBtn";
import { StUser } from "../components/styled/StUser";
import { StAnchor } from "../components/styled/StAnchor";

import { UserCtrBtns } from "../components/styled/UserCtrBtns";

class User extends Component {
  constructor(props) {
    super(props);
    this.state = { devs: [], redirUser: false };
  }

  async componentDidMount() {
    //Obtain user from localstorage
    var user = this.getUser(false);

    var res = await fetch("/user/devupd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });
    var resJson = await res.json();
    if (resJson.status === "ok") {
      // "resJson.data" is array of devices with updated properties
      this.setState({ devs: resJson.data });
    } else {
    }
  }

  render() {
    // if (!this.state.user) {
    //   return this.redirectHome();
    // }
    return (
      <div>
        {this.renderRedirect()}
        <StUser>
          <h1>{"waiting"}</h1>
          {/*eslint-disable */}
          <UserCtrBtns>
            <StlAddDevBtn onClick={this.addNewDevice}>Add Device</StlAddDevBtn>
            <StAnchor href="" onClick={this.logout}>
              Logout
            </StAnchor>
            {/*eslint-enable */}
          </UserCtrBtns>
          <Devices devs={this.state.devs} />
        </StUser>
      </div>
    );
  }

  updateState() {}

  renderRedirect = () => {
    if (this.state.redirUser) {
      return <Redirect to="/AddNewDevice" />;
    }
  };

  addNewDevice = e => {
    this.setState({ redirUser: true });
  };
  logout = e => {
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
  };

  // getDeviceUpdateObject(dbUser) {
  //   var { devices } = dbUser;
  //   devices.map(dev => {});
  // }

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
