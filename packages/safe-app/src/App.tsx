import React, { ReactElement } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import theme from "./theme";
import HomePage from "./pages/HomePage";
import IncomingStreamsPage from "./pages/IncomingStreamsPage";

function SablierWidget(): ReactElement {
  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <Switch>
          <Route path="/incoming">
            <IncomingStreamsPage />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </HashRouter>
    </ThemeProvider>
  );
}

export default SablierWidget;
