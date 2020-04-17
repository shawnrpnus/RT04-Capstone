import React from "react";
import { Route, Switch } from "react-router-dom";
import SalesMarketingRoute from "../SalesMarketingRoute";
import SalesGraph from "../../../components/SalesGraphs/SalesGraph";
import ReservationsGraph from "../../../components/ReservationsGraph/ReservationsGraph";

export default () => (
  <Switch>
    <SalesMarketingRoute exact path="/analytics/sales" component={SalesGraph} />
    <SalesMarketingRoute
      exact
      path="/analytics/reservations"
      component={ReservationsGraph}
    />
  </Switch>
);
