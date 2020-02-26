import React from "react";
import { Redirect, Route } from "react-router-dom";

const SecuredRoute = ({ component: Component, ...rest }) => {
  let authenticated = false;

  if (localStorage.getItem("customer")) {
    authenticated = true;
  }

  return (
    <Route
      {...rest}
      render={props =>
        authenticated === true ? (
          <Component {...props} />
        ) : (
          <Redirect to="/account/login" />
        )
      }
    />
  );
};

export default SecuredRoute;
