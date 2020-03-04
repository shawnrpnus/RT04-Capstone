import React from "react";

import { InventoryTable } from "../../../components/Warehouse";
import { Route, Switch } from "react-router-dom";
import { ProductCard } from "../../../components/Product/ProductPage";
import RetailRoute from "./../RetailRoute";

export default () => (
  <Switch>
    <RetailRoute
      exact
      path="/warehouse/viewWarehouse"
      component={InventoryTable}
    />
    <RetailRoute
      exact
      path="/warehouse/viewProductStocksDetails/:id"
      component={ProductCard}
    />
  </Switch>
);
