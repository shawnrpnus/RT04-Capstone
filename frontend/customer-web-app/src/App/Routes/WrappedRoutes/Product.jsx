import React from "react";
import { Route, Switch } from "react-router-dom";
import Register from "components/Register";
import VerifyEmailChecker from "components/EmailVerification/VerifyEmailChecker";
import VerifyEmailPrompt from "components/EmailVerification/VerifyEmailPrompt";
import LoginPage from "components/Login/LoginPage";
import ProfilePage from "components/Profile/ProfilePage";
import SecuredRoute from "App/Routes/SecuredRoute";
import ForgotPassword from "components/Login/ForgotPassword";
import ResetPassword from "components/Login/ResetPassword";
import ProductPage from "components/Shop/ProductsPage";

export default () => (
  <Switch>
    <Route
      exact
      path="/shop/:rootCategoryName/:subCategoryName/:leafCategoryName?"
      component={ProductPage}
    />
  </Switch>
);
