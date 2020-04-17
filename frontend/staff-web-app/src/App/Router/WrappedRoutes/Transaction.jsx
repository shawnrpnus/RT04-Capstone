import React from "react";
import { Switch } from "react-router-dom";
import { TransactionTable } from "../../../components/Transaction";
import RetailRoute from "../RetailRoute";
import ViewTransactionDetails from "../../../components/Transaction/components/ViewTransactionDetails";

export default () => (
  <Switch>
    <RetailRoute
      exact
      path="/transaction/viewAll"
      component={TransactionTable}
    />
    <RetailRoute
      exact
      path="/transaction/viewOne"
      component={ViewTransactionDetails}
    />
  </Switch>
);
