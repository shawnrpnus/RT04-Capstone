import React from "react";
import {
  RestockOrderItemTable,
  DeliveryTable
} from "../../../components/Delivery";
import { Route, Switch } from "react-router-dom";
import DeliveryRoute from "../DeliveryRoute";

export default () => (
  <Switch>
    <DeliveryRoute
      exact
      path="/delivery/viewAllDelivery"
      component={DeliveryTable}
    />
    <DeliveryRoute
      exact
      path="/delivery/viewAllRestockOrderItem"
      component={RestockOrderItemTable}
    />
  </Switch>
);
