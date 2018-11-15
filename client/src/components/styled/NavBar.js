import React, { Component } from "react";
import styled from "styled-components";
// import { Redirect } from "react-router-dom";

const NavCont = styled.div`
  display: block;
  width: 100%;
  overflow: auto;
`;

const Ul = styled.ul`
  display: block;
  text-align: center;
  margin-bottom: 70px;
`;

const Li = styled.li`
  list-style-type: none;
  float: left;
  margin: 10px;
`;

const Anchor = styled.a`
  text-decoration: none;
  font-family: sans-serif;
  color: rgb(50, 180, 50);
  padding: 10px;
  :hover {
    color: rgb(2, 22, 2);
    font-size: 110%;
  }
`;

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <NavCont>
          <Ul>
            <Li>
              <Anchor href="/">Home</Anchor>
            </Li>
            <Li>
              <Anchor href="/Register">Register</Anchor>
            </Li>
            <Li>
              <Anchor href="/Login">Login</Anchor>
            </Li>
          </Ul>
        </NavCont>
      </React.Fragment>
    );
  }
}

export default NavBar;
