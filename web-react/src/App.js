import React from "react";
import "antd/dist/antd.css";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import UserHome from "./components/UserHome";
import UserSpaces from "./components/UserSpaces";

export default function App() {
  return (
    <Router>
      <div>
        <main>
          <div />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/signin" component={SignIn} />
            <Route exact path="/home" component={UserHome} />
            <Route exact path="/spaces" component={UserSpaces} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}
