import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import WelcomeScreen from "./WelcomeScreen";
import ChatScreen from "./ChatScreen";

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/chat" component={ChatScreen} />
        <Route path="/" component={WelcomeScreen} />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
