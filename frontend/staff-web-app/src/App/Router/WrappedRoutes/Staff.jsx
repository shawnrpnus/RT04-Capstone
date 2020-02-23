import React from "react";
import { Route, Switch } from "react-router-dom";
import { StaffFormContainer } from "../../../components/Staff";
// import {StaffAccountFormContainer} from "../../../components/Staff/components/StaffAccountFormContainer";

export default () => (
  <Switch>
    <Route
      exact
      path="/staff/create"
      render={props => <StaffFormContainer {...props} mode="create" />}
    />

  </Switch>
);
