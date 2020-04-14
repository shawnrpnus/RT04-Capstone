import React from "react";
import { Route, Switch } from "react-router-dom";
import { Dashboard } from "../../../components/Dashboard";
import SecureRoute from "./../SecureRoute";

export default () => (
  <Switch>
    <SecureRoute exact path="/dashboard" component={Dashboard}></SecureRoute>
  </Switch>
);
