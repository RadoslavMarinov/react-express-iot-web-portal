import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import code from "jwt-simple";
import Devices from "../components/Devices";
import { updateSession } from "../libs/session";
const KEY = "taina";

class User extends Component {
  constructor(props) {
    super(props);
    this.state = { user: true };
  }

  printState = () => {
    console.log("State Updated: " + this.state);
  };

  getUserData = async () => {
    //Updated user state can be found in this.props.location.user
    if (this.props.location.fromLogin) {
      console.log("From login");
      return this.props.location.user;
    }
    // Otherwise if session persist, we have to make a server request to update the user
    else {
      try {
        var session = code.decode(localStorage.getItem("sessionId"), KEY);
      } catch (error) {
        this.setState({ userData: false }, this.printState);
        console.log("No user data in local strage");
      }

      var { username } = session.user;
      const res = await fetch("/api/user/get-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username
        })
      });

      const resJs = await res.json();
      return resJs;
    }
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

  async componentDidMount() {
    var newUserData = await this.getUserData();
    updateSession(newUserData);
    // console.log("newUserData", newUserData);
    var devices = newUserData.user.devices;
    console.log("Devices:", devices);
    this.setState({ user: newUserData });
  }

  render() {
    if (!this.state.user) {
      return this.redirectHome();
    }
    return (
      <React.Fragment>
        <h1>{this.state.user.user ? this.state.user.username : "waiting"}</h1>
        <a href="http://localhost:3000/Login">Login</a>
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
