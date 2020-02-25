import React from "react";
import { Route, Switch } from "react-router-dom";
import Register from "components/Register";
import Banner from "components/Layout/components/Banner";
import VerifyEmailConfirmation from "components/Layout/components/Banner/components/VerifyEmailConfirmation";

export default () => (
  <Switch>
    <Route exact path="/account/register" component={Register} />
    <Route
      exact
      path="/account/verifyEmail"
      render={props => <Banner verifyEmail {...props} />}
    />
    <Route
      exact
      path="/account/verify/:verificationCode"
      render={props => <Banner verifyEmailConfirmation {...props} />}
    />
  </Switch>
);
