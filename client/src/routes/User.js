import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Devices from "../components/Devices";

class User extends Component {
  constructor(props) {
    super(props);
    this.state = { user: true };
  }

  logout(e) {
    console.log(e.target);
    e.preventDefault();
    localStorage.removeItem("user");
    var res = fetch("/Logout", { method: "GET", redirect: "follow" })
      .then(res => {
        console.log("response status: " + res.status);
        window.location.assign(res.url);
      })
      .catch(err => {
        console.log("Error: " + err);
      });
  }

  getUser(tostring) {
    var user = localStorage.getItem("user");
    if (tostring) {
      return JSON.stringify(user, null, 3);
    } else {
      return user;
    }
  }

  async componentWillMount() {}
  async componentDidMount() {
    console.log(this.getUser(false));
  }

  render() {
    if (!this.state.user) {
      return this.redirectHome();
    }
    return (
      <React.Fragment>
        <h1>{this.state.user.user ? this.state.user.username : "waiting"}</h1>
        <a href="javascript:void(0)" onClick={this.logout}>
          Logout
        </a>
        <div>
          {this.state.user.user ? (
            <Devices devices={this.state.user.user.devices} />
          ) : (
            <p>Alabama</p>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default User;
