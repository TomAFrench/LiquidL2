import React, { ReactElement } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";

function App(): ReactElement {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          {" "}
          Hello World!{" "}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
