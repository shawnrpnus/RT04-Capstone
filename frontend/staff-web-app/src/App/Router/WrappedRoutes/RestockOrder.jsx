import React from "react";
import { RestockOrderTable } from "../../../components/RestockOrder";
import { Route, Switch } from "react-router-dom";
import RetailRoute from "./../RetailRoute";

export default () => (
  <Switch>
    <RetailRoute
      exact
      path="/restockOrder/viewAll"
      component={RestockOrderTable}
    />
  </Switch>
);
