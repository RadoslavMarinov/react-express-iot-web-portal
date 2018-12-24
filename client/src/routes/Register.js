import React, { Component } from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";

/************************************************************************* */
const FormWrapper = styled.div`
  padding: 10px;
  border-radius: 5px;
  background-color: #f2f2f2;
`;

const SubmitButt = styled.button`
  color: red;
`;

const Label = styled.label`
  color: rgb(50, 200, 50);
`;

const Input = styled.input`
  width: 100%;
  display: block;
  margin: 8px 0;
`;

const Info = styled.p``;
/************************************************************************* */
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      deviceId: "",
      password: "",
      password2: "",
      redirect: false,
      info: ""
    };
  }

  validate = () => {
    let msg = "";
    if (!this.state.email.includes("@")) {
      msg = "Invalid email";
    } else if (this.state.password !== this.state.password2) {
      msg = "Passwords must be the same!";
    } else if (this.state.password.length < 5) {
      msg = "Passwords must be at least 5 symbols!";
    } else {
      return "valid";
    }
    return msg;
  };

  submitForm = async e => {
    e.preventDefault();

    const validateMsg = this.validate();
    if (validateMsg !== "valid") {
      this.setState({ info: validateMsg });
      console.log(" *** Form not valid!");
      return;
    } else {
      this.setState({ info: "" });
    }

    const res = await fetch("/api/reg-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.state.email,
        username: this.state.username,
        deviceId: this.state.deviceId,
        password: this.state.password
      })
    });
    const resJson = await res.json();
    //  const resData = await JSON.parse(res.body);
    console.log(JSON.stringify(resJson));
    // this.setState({ redirect: true });
  };

  handleChange = e => {
    //  console.log(e.target.name);
    this.setState({ [e.target.name]: e.target.value });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return (
        <Redirect
          to={{ pathname: "/Login", msg: "Redirected from register" }}
        />
      );
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.renderRedirect()}
        <h1>Hello from Register</h1>;
        <FormWrapper>
          <form>
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
              placeholder="Place your emaile here"
            />
            <Label>Username</Label>
            <Input
              name="username"
              type="text"
              value={this.state.username}
              onChange={this.handleChange}
              placeholder="Place your username here"
            />
            <Label>Device Id</Label>
            <Input
              name="deviceId"
              type="text"
              value={this.state.deviceId}
              onChange={this.handleChange}
              placeholder="Place your Device Id here"
            />
            <Label>Password</Label>
            <Input
              name="password"
              type="password"
              onChange={this.handleChange}
              placeholder="*****"
            />
            <Label>Repeat the password</Label>
            <Input
              name="password2"
              type="password"
              onChange={this.handleChange}
              placeholder="*****"
            />
            <SubmitButt onClick={this.submitForm}>Submit</SubmitButt>
            <Info>{this.state.info}</Info>
          </form>
        </FormWrapper>
      </React.Fragment>
    );
  }
}

export default Register;
