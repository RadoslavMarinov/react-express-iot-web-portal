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

    // this.setState({ disabled: true });

    // console.log(`Name: ${swName}; Device ID: ${this.props.dev.id}`);
    // this.level === 1 ? (this.level = 0) : (this.level = 1);
    // const res = await fetch("/user/ep", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: `{ "devId":"${this.props.dev.id}","msg":{"${key}" : ${this.level}}}`
    // });
    // const resJson = await res.json();

    // if (resJson.status === "ok") {
    //   var ep = resJson.data.endpoints.find(x =>
    //     x.hasOwnProperty(this.props.name)
    //   );
    //   console.log(ep[this.props.name].state);
    //   this.setState({ level: ep[this.props.name].state, disabled: false });
    // } else {
    //   console.log(resJson.status, resJson.message);
    //   this.setState({ disabled: false });
    // }

    //Find endpoint:
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
