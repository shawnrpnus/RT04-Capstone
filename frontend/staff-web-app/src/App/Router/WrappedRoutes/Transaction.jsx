import React from "react";
import { Switch } from "react-router-dom";
import { TransactionTable } from "../../../components/Transaction";
import RetailRoute from "../RetailRoute";

export default () => (
  <Switch>
    <RetailRoute
      exact
      path="/transaction/viewAll"
      component={TransactionTable}
    />
  </Switch>
);
