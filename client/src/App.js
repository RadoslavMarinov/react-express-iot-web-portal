import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import "./components/socket-io";

import Home from "./routes/Home";
import Auth from "./routes/Auth";
import Login from "./routes/Login";
import Register from "./routes/Register";
import User from "./routes/User";
import AddNewDevice from "./routes/AddNewDevice";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/Home" render={props => <Home {...props} />} />
          <Route exact path="/login" render={props => <Login {...props} />} />
          <Route
            exact
            path="/register"
            render={props => <Register {...props} />}
          />
          <Route exact path="/auth" render={props => <Auth {...props} />} />
          <Route exact path="/user" render={props => <User {...props} />} />
          <Route
            exact
            path="/AddNewDevice"
            render={props => <AddNewDevice {...props} />}
          />
        </Switch>
      </BrowserRouter>
    );
  }
}
export default App;
