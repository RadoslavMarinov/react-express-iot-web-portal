import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./components/socket-io";

import Home from "./routes/Home";
import Auth from "./routes/Auth";
import Login from "./routes/Login";
import Register from "./routes/Register";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={props => <Home {...props} />} />
          <Route exact path="/login" render={props => <Login {...props} />} />
          <Route
            exact
            path="/register"
            render={props => <Register {...props} />}
          />
          <Route exact path="/auth" render={props => <Auth {...props} />} />
        </Switch>
      </BrowserRouter>
    );
  }
}
export default App;

/*
  state = {
    response: "",
    post: "",
    responseToPost: ""
  };
  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res }))
      .catch(err => console.log(err));
  }
  callApi = async () => {
    const response = await fetch("/api/hello");
    const body = await response.text();
    console.log("EXPRESS RESPONSE:", body);
    if (response.status !== 200) throw Error(body.message);
    return body;
  };
  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch("/api/world", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ post: this.state.post })
    });
    const body = await response.text();
    this.setState({ responseToPost: body });
  };

*/
