import styled from "styled-components";

const StAnchor = styled.a`
  text-decoration: none;
  color: rgba(0, 150, 0, 0.8);
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bolder;
  padding-top: 10px;
  padding-right: 40px;
  padding-bottom: 10px;
  padding-left: 40px;
  display: table-cell;
  vertical-align: middle;
  position: relative;
  margin: 2px;
  :hover {
    box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24),
      0 17px 50px 0 rgba(0, 0, 0, 0.19);
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

export { StAnchor };

// border: none;
// color: white;
// padding: 15px 32px;
// text-align: center;
// text-decoration: none;
// display: inline-block;
// font-size: 16px;
// margin: 4px 2px;
// cursor: pointer;
