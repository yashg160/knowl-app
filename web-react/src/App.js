import React from "react";
import "antd/dist/antd.css";

import Home from "./components/Home";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Question from "./components/Question";
import UserHome from "./components/UserHome";
import UserSpaces from "./components/UserSpaces";
import UserProfile from "./components/UserProfile";
import AskQuestion from "./components/AskQuestion";

import { Switch, Route, BrowserRouter as Router } from "react-router-dom";

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
            <Route exact path="/profile/:userId" component={UserProfile} />
            <Route exact path="/questions/:id" component={Question} />
            <Route exact path="/askQuestion" component={AskQuestion} />
            <Route exact path="/selectSpaces" component={UserSpaces} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}
