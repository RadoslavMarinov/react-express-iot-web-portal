import React, { Component } from "react";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <h1>Hello from Login {this.props.location.msg}</h1>;
  }
}

export default Login;
