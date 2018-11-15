import React, { Component } from "react";
import NavBar from "../components/styled/NavBar";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { user: "" };
  }

  getQueryStr(params) {
    let query = Object.keys(params)
      .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
      .join("&");

    return query;
  }

  componentDidMount() {}

  render() {
    return (
      <React.Fragment>
        <NavBar />
        <h1 style={{ display: "block" }}>Hello {this.state.user}</h1>;
      </React.Fragment>
    );
  }
}

export default Home;
