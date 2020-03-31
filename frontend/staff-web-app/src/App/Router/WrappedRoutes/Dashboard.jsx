import React from "react";
import { Route, Switch } from "react-router-dom";
import { Dashboard } from "../../../components/Dashboard";

export default () => (
  <Switch>
    <Route exact path="/dashboard" component={Dashboard}></Route>
  </Switch>
);
