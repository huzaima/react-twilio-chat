import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route
} from "react-router-dom";
import WelcomeScreen from './WelcomeScreen';
import ChatScreen from './ChatScreen';

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/chat" component={ChatScreen} />

        {/*  We're not using "exact" prop so that any unmatched URL brings us to the welcome screen */}
        <Route path="/" component={WelcomeScreen} />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
