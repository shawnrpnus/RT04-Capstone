import React from "react";
import { Route, Switch } from "react-router-dom";
import SalesMarketingRoute from "../SalesMarketingRoute";
import SalesGraph from "../../../components/SalesGraphs/SalesGraph";

export default () => (
  <Switch>
    <SalesMarketingRoute
      exact
      path="/analytics/sales"
      component={SalesGraph}
    />
  </Switch>
);
