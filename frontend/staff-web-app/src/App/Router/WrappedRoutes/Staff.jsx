import React from "react";
import { Route, Switch } from "react-router-dom";
import StaffCreateForm from "../../../components/Staff/components/StaffCreateForm";
import StaffAccountCreateForm from "../../../components/Staff/components/StaffAccountCreateForm";
import StaffTable from "../../../components/Staff/components/StaffTable";
import StaffDetailsPage from "../../../components/Staff/components/StaffDetailsPage";
import ResetPasswordForm from "../../../components/Staff/components/ResetPasswordForm";

export default () => (
  <Switch>
    <Route path="/staff/create" component={StaffCreateForm} />
    <Route path="/staff/createAccount" component={StaffAccountCreateForm} />
    <Route path="/staff/viewAll" component={StaffTable} />
    <Route path="/staff/viewProfile" component={StaffDetailsPage} />

  </Switch>
);
