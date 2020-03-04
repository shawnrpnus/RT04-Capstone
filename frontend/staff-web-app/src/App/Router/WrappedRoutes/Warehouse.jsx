import React from "react";

import { InventoryTable } from "../../../components/Warehouse";
import { Route, Switch } from "react-router-dom";
import { ProductCard } from "../../../components/Product/ProductPage";
import SecureRoute from "../SecureRoute";

export default () => (
  <Switch>
    <SecureRoute
      exact
      path="/warehouse/viewWarehouse"
      component={InventoryTable}
    />
    <SecureRoute
      exact
      path="/warehouse/viewProductStocksDetails/:id"
      component={ProductCard}
    />
  </Switch>
);
