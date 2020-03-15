import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import SecureRoute from "./SecureRoute";
const _ = require("lodash");

const SalesMarketingRoute = ({ component: Component, render, ...rest }) => {
  const staff = useSelector(state => state.staffEntity.loggedInStaff);

  return (
    <SecureRoute
      {...rest}
      render={props => {
        if (staff) {
          return Component ? (
            <Component {...props} staff={staff} />
          ) : (
            render(props)
          );
        }
        return <Redirect to="/" />;
      }}
    />
  );
};

export default SalesMarketingRoute;
