import React from "react";
import { Route, Switch } from "react-router-dom";
import RetailRoute from "../RetailRoute";
import { ReviewTable } from "../../../components/Review";

export default () => (
  <Switch>
      <RetailRoute
          exact
          path="/review/viewAll"
          component={ReviewTable}
      />
  </Switch>
);
