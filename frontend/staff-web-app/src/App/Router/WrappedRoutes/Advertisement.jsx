import React from "react";
import { Route, Switch } from "react-router-dom";
import {
  AdvertisementTable,
  SelectionTable,
  InstagramManagementTable
} from "../../../components/Advertisement";
import SalesMarketingRoute from "../SalesMarketingRoute";

export default () => (
  <Switch>
    <SalesMarketingRoute
      exact
      path="/advertisement/viewAllAdvertisement"
      component={AdvertisementTable}
    />
    <SalesMarketingRoute
      exact
      path="/instagram/viewInstagramByHashtag"
      component={SelectionTable}
    />
    <SalesMarketingRoute
      exact
      path="/instagram/viewAllInstagramPost"
      component={InstagramManagementTable}
    />
  </Switch>
);
