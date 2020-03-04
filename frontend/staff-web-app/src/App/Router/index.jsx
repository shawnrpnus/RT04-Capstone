import React from "react";
import { Route, Switch } from "react-router-dom";
import WrappedRoutes from "./WrappedRoutes";
import MainWrapper from "./MainWrapper";
import LogInForm from "../../shared/components/Login/LogInForm";
import LoginCard from "../../shared/components/Login/LoginCard";
import StaffLoginForm from "../../components/Staff/components/StaffLoginForm";
import ResetPasswordForm from "../../components/Staff/components/ResetPasswordForm";
import SecureRoute from "./SecureRoute";

const Router = () => (
  <MainWrapper>
    <main>
      <Switch>
        <Route path="/login" component={StaffLoginForm} />
        <Route path="/resetPassword" component={ResetPasswordForm} />
        <SecureRoute path="/" component={WrappedRoutes} />
      </Switch>
    </main>
  </MainWrapper>
);

export default Router;
