// import React, { Component } from "react";
import styled from "styled-components";

const StBinSwitch = styled.button`
  display: inline-block;
  border: 2px solid grey;
  background-color: ${props =>
    props.bgColor ? props.bgColor : "rgba(0, 0, 0, 0.1)"};
  margin: 8px 8px;
  border-radius: 8px;
  border-width: 1px;
`;

export { StBinSwitch };
// rgba(0, 0, 0, 0.5)
