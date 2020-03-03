import React from "react";
import { Route, Switch } from "react-router-dom";
import { CategoryTree } from "../../../components/Category";
import SecureRoute from "../SecureRoute";

export default () => (
  <Switch>
    <SecureRoute exact path="/category/viewAll" component={CategoryTree} />
  </Switch>
);
