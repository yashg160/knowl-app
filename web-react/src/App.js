import React from "react";
import "antd/dist/antd.css";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import Home from "./components/Home";

export default function App() {
  return (
    <Router>
      <div>
        <main>
          <div />
          <Switch>
            <Route exact path="/" component={Home} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}
