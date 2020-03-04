import React from "react";
import { Route, Switch } from "react-router-dom";
import StaffCreateForm from "../../../components/Staff/components/StaffCreateForm";
import StaffAccountCreateForm from "../../../components/Staff/components/StaffAccountCreateForm";
import StaffTable from "../../../components/Staff/components/StaffTable";
import StaffDetailsPage from "../../../components/Staff/components/StaffDetailsPage";
import HRRoute from "../HRRoute";
import SecureRoute from "../SecureRoute";
import ITRoute from "../ITRoute";

export default () => (
  <Switch>
    <HRRoute path="/staff/create" component={StaffCreateForm} />
    <ITRoute path="/staff/createAccount" component={StaffAccountCreateForm} />
    <HRRoute path="/staff/viewAll" component={StaffTable} />
    <SecureRoute path="/staff/viewProfile" component={StaffDetailsPage} />
  </Switch>
);
