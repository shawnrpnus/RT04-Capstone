import React from "react";

import { Route, Switch } from "react-router-dom";
import ShoppingCart from "../../../components/ShoppingCart/ShoppingCartPage";

export default () => (
  <Switch>
    <Route exact path="/shoppingCart" component={ShoppingCart} />
  </Switch>
);
