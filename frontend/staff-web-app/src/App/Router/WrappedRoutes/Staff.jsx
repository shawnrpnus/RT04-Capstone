import React from "react";
import { Route, Switch } from "react-router-dom";
import StaffCreateForm from "../../../components/Staff/components/StaffCreateForm";
import StaffTable from "../../../components/Staff/components/StaffTable";
import StaffDetailsPage from "../../../components/Staff/components/StaffDetailsPage";
import HRRoute from "../HRRoute";
import SecureRoute from "../SecureRoute";
import ResetPasswordForm from "../../../components/Staff/components/ResetPasswordForm";
import StaffViewEditPage from "../../../components/Staff/components/StaffViewEditPage";

export default () => (
  <Switch>
    <HRRoute path="/staff/create" component={StaffCreateForm} />
    <HRRoute path="/staff/resetPassword" component={ResetPasswordForm} />
    <HRRoute path="/staff/viewAll" component={StaffTable} />
    <SecureRoute path="/staff/viewProfile" component={StaffDetailsPage} />
      <SecureRoute
          path="/staff/view/:staffId"
          render={props => <StaffViewEditPage {...props} mode="view"/>}
      />
      <SecureRoute
          path="/staff/update/:staffId"
          render={props => <StaffViewEditPage {...props} mode="update" />}
      />
  </Switch>
);
