import React, { Component } from "react";

class BinarySwitch extends Component {
  constructor(props) {
    super(props);
    this.state = { level: 1 };
    this.level = 1;
  }

  onClick = async e => {
    var swName = e.target.name;
    /* suffix 's' stands for "set" command.
      thus for 'key' we will have something like 
      this: bs1s
    */
    var key = swName + "s"; //suffix 's' stands for "set" command
    console.log(`Name: ${swName}; Device ID: ${this.props.dev.id}`);
    this.level === 1 ? (this.level = 0) : (this.level = 1);
    var res = fetch("/user/ep", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: `{ "devId":"${this.props.dev.id}","msg":{"${key}" : ${this.level}}}`
    });
  };

  render() {
    return (
      <button onClick={this.onClick} name={this.props.name}>
        {this.props.displayName}
      </button>
    );
  }
}

export default BinarySwitch;
