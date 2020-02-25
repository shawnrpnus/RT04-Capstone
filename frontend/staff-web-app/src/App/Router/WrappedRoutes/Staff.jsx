import React from "react";
import { Route, Switch } from "react-router-dom";
import StaffCreateForm from "../../../components/Staff/components/StaffCreateForm";

export default () => (
  <Switch>
    <Route path="/staff/create" component={StaffCreateForm} />}
    />
  </Switch>
);
