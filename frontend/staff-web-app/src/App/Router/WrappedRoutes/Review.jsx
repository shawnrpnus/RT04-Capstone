import React from "react";
import { Route, Switch } from "react-router-dom";
import { ReviewTable } from "../../../components/Review";
import CRMRoute from "../CRMRoute";

export default () => (
  <Switch>
    <CRMRoute exact path="/review/viewAll" component={ReviewTable} />
  </Switch>
);
