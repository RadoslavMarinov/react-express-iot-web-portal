import React, { Component } from "react";
import NavBar from "../components/styled/NavBar";
import code from "jwt-simple";
import { socket } from "../components/socket-io";

const KEY = "taina";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { user: "", isAuthenticated: false, info: "" };

    socket.on("change", data => {
      this.setState({ info: data });
      console.log(data);
    });
  }

  isAuthenticated = () => {
    var sessionId = localStorage.getItem("sessionId");
    var now_secs = Date.now() / 1000;

    if (sessionId) {
      var session = code.decode(sessionId, KEY);
      var { expTime } = session;

      console.log("Now: " + now_secs, "ExpTime: " + expTime);

      if (now_secs > expTime) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
      // this.setState({ isAuthenticated: false });
    }
  };

  async componentDidMount() {
    if (this.isAuthenticated()) {
      this.setState({ isAuthenticated: true });
    } else {
      this.setState({ isAuthenticated: false });
    }
  }

  render() {
    return (
      <React.Fragment>
        <NavBar />
        {this.state.isAuthenticated ? (
          <h1>Authenticated</h1>
        ) : (
          <h1>Not Authenticated</h1>
        )}
      </React.Fragment>
    );
  }
}

// getQueryStr(params) {
//   let query = Object.keys(params)
//     .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
//     .join("&");

//   return query;
// }

export default Home;
