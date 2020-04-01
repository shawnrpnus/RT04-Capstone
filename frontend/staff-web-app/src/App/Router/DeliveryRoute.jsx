import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import SecureRoute from "./SecureRoute";
const _ = require("lodash");

const DeliveryRoute = ({ component: Component, render, ...rest }) => {
  let staff = useSelector(state => state.staffEntity.loggedInStaff);
  let store = staff.store;

  return (
    <SecureRoute
      {...rest}
      render={props => {
        const department = _.get(staff, "department.departmentName");
        if (department === "Delivery") {
          return Component ? (
            <Component {...props} store={store} staff={staff} />
          ) : (
            render(props)
          );
        }
        return <Redirect to="/" />;
      }}
    />
  );
};

export default DeliveryRoute;
