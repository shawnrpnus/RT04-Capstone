import React from "react";
import { Switch } from "react-router-dom";
import { Dashboard } from "../../../components/Dashboard";
import RetailRoute from "./../RetailRoute";

export default () => (
  <Switch>
    <RetailRoute exact path="/dashboard" component={Dashboard} />
  </Switch>
);
