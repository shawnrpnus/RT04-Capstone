import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useSelector } from "react-redux";

const SecureRoute = ({ component: Component, ...rest }) => {
  let authenticated = false;
  let staff = useSelector(state => state.staffEntity.loggedInStaff);

  if (staff) authenticated = true;

  return (
    <Route
      {...rest}
      render={props =>
        authenticated === true ? (
          <Component {...props} staff={staff} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default SecureRoute;
