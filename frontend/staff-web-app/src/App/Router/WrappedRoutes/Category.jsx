import React from "react";
import { Route, Switch } from "react-router-dom";
import { CategoryTree } from "../../../components/Category";

export default () => (
  <Switch>
    <Route exact path="/category/viewAll" component={CategoryTree} />
  </Switch>
);
