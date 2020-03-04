import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useSelector } from "react-redux";

const SecureRoute = ({ component: Component, render, ...rest }) => {
  let authenticated = false;
  let staff = useSelector(state => state.staffEntity.loggedInStaff);

  if (staff) authenticated = true;

  return (
    <Route
      {...rest}
      render={props => {
        if (authenticated === true) {
          return Component ? (
            <Component {...props} staff={staff} />
          ) : (
            render(props)
          );
        }
        return <Redirect to="/login" />;
      }}
    />
  );
};

export default SecureRoute;
