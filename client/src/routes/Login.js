import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import code from "jwt-simple";

import NavBar from "../components/styled/NavBar";
import { UserInput, Label, SubmitButt } from "../components/styled/Forms";
import styled from "styled-components";

const KEY = "taina";

const FormWrapper = styled.div`
  padding: 10px;
  border-radius: 5px;
  background-color: #f2f2f2;
`;
const Form = styled.form``;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      toUser: false,
      user: {}
    };
  }

  submitForm = async e => {
    e.preventDefault();
    const res = await fetch("/api/login/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    });
    const resJson = await res.json();

    if (resJson.status === "OK") {
      localStorage.setItem("sessionId", code.encode(resJson, KEY));

      this.setState({ toUser: true, user: resJson, fromLogin: true });
    }

    //   var sessionId = code.decode(localStorage.getItem("sessionId"), KEY);
    //   console.log(sessionId);
    // }

    // if (resJson.status === "OK") {
    //   var { session, devices } = resJson;
    //   if (session) {
    //     localStorage.setItem("sessionId", code.encode(session, KEY));
    //   }

    //   if (!devices) {
    //     throw new Error("User must have devices registered! ");
    //   }
    //   console.log("devices: ", devices);
    //   this.setState({ toUser: true, user: resJson });
    // }
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    if (this.state.toUser) {
      return (
        <Redirect
          to={{ pathname: "/User", user: this.state.user, fromLogin: true }}
        />
      );
    }

    return (
      <React.Fragment>
        <NavBar /> <h1>Hello from Login {this.props.location.msg}</h1>
        <FormWrapper>
          <Form>
            <Label>Username</Label>
            <UserInput
              name="username"
              type="text"
              placeholder="Type your username here"
              value={this.state.name}
              onChange={this.onChange}
            />
            <Label>Password</Label>
            <UserInput
              name="password"
              type="password"
              placeholder="Type your password here"
              value={this.state.name}
              onChange={this.onChange}
            />
            <SubmitButt onClick={this.submitForm}>Submasdasdit</SubmitButt>
          </Form>
        </FormWrapper>
      </React.Fragment>
    );
  }
}

export default Login;
