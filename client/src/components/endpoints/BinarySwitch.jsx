import React, { Component } from "react";

class BinarySwitch extends Component {
  constructor(props) {
    super(props);
    this.state = { level: 1, disabled = false };
    this.level = 1;
  }

  onClick = async e => {
    var swName = e.target.name;
    /* suffix 's' stands for "set" command.
      thus for 'key' we will have something like 
      this: bs1s
    */

    this.setState({disabled:true});

    var key = swName + "s"; //suffix 's' stands for "set" command
    console.log(`Name: ${swName}; Device ID: ${this.props.dev.id}`);
    this.level === 1 ? (this.level = 0) : (this.level = 1);
    const res = await fetch("/user/ep", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: `{ "devId":"${this.props.dev.id}","msg":{"${key}" : ${this.level}}}`
    });
    const resJson = await res.json();

    if (resJson.status == "ok") {
      var ep = resJson.data.endpoints.find(x =>
        x.hasOwnProperty(this.props.name)
      );
      console.log(ep[this.props.name].state);
      this.setState({ level: ep[this.props.name].state, disabled: false });
    } else {
      console.log(resJson.status, resJson.message);
      this.setState({disabled:false});
    }

    //Find endpoint:
  };

  render() {
    return (
      <button onClick={this.onClick} name={this.props.name} 
      disabled={this.state.disabled}>
        {this.props.displayName + " " + this.state.level} 
      </button>
    );
  }
}

export default BinarySwitch;
