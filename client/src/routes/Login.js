import React, { Component } from "react";
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
    this.state = { username: "", password: "" };
  }

  submitForm = e => {
    e.preventDefault();
    console.log(this.state.username);
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

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
          </Form>
        </FormWrapper>
      </React.Fragment>
    );
  }
}

export default Login;
