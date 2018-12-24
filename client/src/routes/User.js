import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import code from "jwt-simple";
import Devices from "../components/Devices";
const KEY = "taina";

class User extends Component {
  constructor(props) {
    super(props);
    this.state = { user: true };
  }

  printState = () => {
    console.log("State Updated: " + this.state);
  };

  redirectHome = () => {
    return <Redirect to={{ pathname: "/", from: "user" }} />;
  };

  populateDevices = devices => {
    var litems = devices.map(dev => {
      return (
        <li>
          Class: {dev.devClass} Endpoints:{" "}
          {"[ " +
            dev.endpoints.map(ep => {
              return ep.name + "";
            }) +
            "]"}
        </li>
      );
    });

    return <ul>{litems}</ul>;
  };

  async componentDidMount() {}

  render() {
    if (!this.state.user) {
      return this.redirectHome();
    }
    return (
      <React.Fragment>
        <h1>{this.state.user.user ? this.state.user.username : "waiting"}</h1>
        <a href="/Logout">Logout</a>
        <div>
          {this.state.user.user ? (
            <Devices devices={this.state.user.user.devices} />
          ) : (
            <p>No user found</p>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default User;
