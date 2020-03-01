import React from "react";
import { Route, Switch } from "react-router-dom";
import ProductPage from "components/Shop/ProductsPage";
import ProductDetailsPage from "components/Shop/ProductDetailsPage";

export default () => (
  <Switch>
    <Route
      exact
      path="/shop/catalog/:rootCategoryName/:subCategoryName/:leafCategoryName?"
      component={ProductPage}
    />
    <Route
      exact
      path="/shop/product/:productId"
      component={ProductDetailsPage}
    />
  </Switch>
);
