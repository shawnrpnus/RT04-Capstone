import React from "react";
import { Route, Switch } from "react-router-dom";
import { AdvertisementTable } from "../../../components/Advertisement";
import SalesMarketingRoute from "../SalesMarketingRoute";

export default () => (
  <Switch>
    <SalesMarketingRoute
      exact
      path="/advertisement/viewAllAdvertisement"
      component={AdvertisementTable}
    />
  </Switch>
);
