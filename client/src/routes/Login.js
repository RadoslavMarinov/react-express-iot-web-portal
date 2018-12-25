import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import NavBar from "../components/styled/NavBar";
import { UserInput, Label, SubmitButt } from "../components/styled/Forms";
import styled from "styled-components";

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
      info: "Test"
    };
  }

  submitForm = async e => {
    e.preventDefault();
    fetch("/login", {
      method: "POST",
      redirect: "follow",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
      .then(async res => {
        try {
          var resjson = await res.json();
          console.log(resjson);
          this.setState({ info: resjson.message });
          if (resjson.user) {
            localStorage.setItem("user", JSON.stringify(resjson.user));
            window.location.assign(resjson.redirect);
          }
        } catch (error) {
          throw error;
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {}

  render() {
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
            <p>{this.state.info}</p>
          </Form>
        </FormWrapper>
      </React.Fragment>
    );
  }
}

export default Login;
