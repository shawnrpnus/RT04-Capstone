import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useSelector } from "react-redux";

const SecuredRoute = ({ component: Component, ...rest }) => {
  let authenticated = false;
  let customer = useSelector(state => state.customer.loggedInCustomer);

  if (customer) authenticated = true;

  return (
    <Route
      {...rest}
      render={props =>
        authenticated === true ? (
          <Component {...props} customer={customer} />
        ) : (
          <Redirect to="/account/login" />
        )
      }
    />
  );
};

export default SecuredRoute;
