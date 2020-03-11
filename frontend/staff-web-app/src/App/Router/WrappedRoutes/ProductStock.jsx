import React from "react";

import {
  ProductsStockTable,
  ProductStockContainer
} from "../../../components/ProductStock";
import { Route, Switch } from "react-router-dom";
import RetailRoute from "./../RetailRoute";

export default () => (
  <Switch>
    <RetailRoute
      exact
      path="/productStock/viewAll"
      component={ProductsStockTable}
    />
  </Switch>
);
