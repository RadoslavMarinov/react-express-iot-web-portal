import React, { Component } from "react";

class BinarySwitch extends Component {
  constructor(props) {
    super(props);
    this.state = { disabled: false };
  }

  onClick = async e => {
    var swName = e.target.name;
    /* suffix 's' stands for "set" command.
      thus for 'key' we will have something like 
      this: bs1s
    */

    var key = swName + "s"; //suffix 's' stands for "set" command
    this.setState({ disabled: true });
    this.props.onStateChange(swName, {
      key: key,
      value: this.props.level === 1 ? 0 : 1
    });
  };
  componentDidMount() {
    this.setState({ disabled: false });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ disabled: false });
  }

  render() {
    return (
      <button
        onClick={this.onClick}
        name={this.props.name}
        disabled={this.state.disabled}
      >
        {this.props.displayName + " " + this.props.level}
      </button>
    );
  }
}

export default BinarySwitch;
