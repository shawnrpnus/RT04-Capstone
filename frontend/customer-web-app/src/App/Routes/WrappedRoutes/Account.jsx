import React from "react";
import { Route, Switch } from "react-router-dom";
import Register from "components/Register";
import VerifyEmailChecker from "components/EmailVerification/VerifyEmailChecker";
import VerifyEmailPrompt from "components/EmailVerification/VerifyEmailPrompt";
import LoginPage from "components/Login/LoginPage";
import ProfilePage from "components/Profile/ProfilePage";

export default () => (
  <Switch>
    <Route exact path="/account/login" component={LoginPage} />
    <Route exact path="/account/register" component={Register} />
    <Route exact path="/account/profile" component={ProfilePage} />
    <Route exact path="/account/verifyEmail" component={VerifyEmailPrompt} />
    <Route
      exact
      path="/account/verify/:verificationCode"
      component={VerifyEmailChecker}
    />
  </Switch>
);
