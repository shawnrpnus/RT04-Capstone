import React from "react";
import { Route, Switch } from "react-router-dom";
import SalesMarketingRoute from "../SalesMarketingRoute";
import SalesGraph from "../../../components/SalesGraphs/SalesGraph";
import ReservationsGraph from "../../../components/ReservationsGraph/ReservationsGraph";
import CategoryGraph from "../../../components/CategoryGraph/CategoryGraph";

export default () => (
  <Switch>
    <SalesMarketingRoute exact path="/analytics/sales" component={SalesGraph} />
    <SalesMarketingRoute
      exact
      path="/analytics/reservations"
      component={ReservationsGraph}
    />
    <SalesMarketingRoute
      exact
      path="/analytics/category"
      component={CategoryGraph}
    />
  </Switch>
);
