import styled from "styled-components";

const StInfoBar = styled.div`
  background-color: ${props => {
    switch (props.type) {
      case "info":
        return "blue";
      case "error":
        return "red";
      case "warning":
        return "yellow";
      default: {
        return null;
      }
    }
  }};
  text-align: center;
`;

export { StInfoBar };

// border: none;
// color: white;
// padding: 15px 32px;
// text-align: center;
// text-decoration: none;
// display: inline-block;
// font-size: 16px;
// margin: 4px 2px;
// cursor: pointer;
