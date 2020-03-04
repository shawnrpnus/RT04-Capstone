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
import AddressCard from "components/Profile/sections/Address/AddressCard";
import WishlistPage from "components/Wishlist/WishlistPage";
import ShoppingCart from "components/ShoppingCart/ShoppingCartPage";
import CheckOutPage from "components/Checkout/CheckOutPage";
import ReservationCartPage from "components/Reservation/ReservationCart/ReservationCartPage";
import ReservationHomePage from "components/Reservation/ReservationHomePage";

export default () => (
  <Switch>
    <Route exact path="/account/login" component={LoginPage} />
    <Route exact path="/account/register" component={Register} />
    <SecuredRoute exact path="/account/profile" component={ProfilePage} />
    <Route exact path="/account/verifyEmail" component={VerifyEmailPrompt} />
    <Route
      exact
      path="/account/verify/:verificationCode"
      component={VerifyEmailChecker}
    />
    <Route
      exact
      path="/account/updateEmail/:verificationCode"
      render={props => <VerifyEmailChecker {...props} isUpdateEmail />}
    />
    <Route exact path="/account/forgotPassword" component={ForgotPassword} />
    <Route
      exact
      path="/account/resetPassword/:verificationCode"
      component={ResetPassword}
    />
    <Route exact path="/account/address" component={AddressCard} />
    <SecuredRoute exact path="/account/wishlist" component={WishlistPage} />
    <SecuredRoute
      exact
      path="/account/reservationCart"
      component={ReservationCartPage}
    />
    <SecuredRoute exact path="/account/shoppingCart" component={ShoppingCart} />
    <SecuredRoute exact path="/account/checkout" component={CheckOutPage} />
    <SecuredRoute
      exact
      path="/account/reservation/:mode/:reservationId?"
      component={ReservationHomePage}
    />
  </Switch>
);
