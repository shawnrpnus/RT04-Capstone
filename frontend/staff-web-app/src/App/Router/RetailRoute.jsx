import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import SecureRoute from "./SecureRoute";
const _ = require("lodash");

const RetailRoute = ({ component: Component, render, ...rest }) => {
  let staff = useSelector(state => state.staffEntity.loggedInStaff);
  let store = useSelector(state => state.staffEntity.selectedStore);

  return (
    <SecureRoute
      {...rest}
      render={props => {
        const department = _.get(staff, "department.departmentName");
        if (
          department === "Store" ||
          department === "Warehouse" ||
          department.toString() === "Sales and Marketing"
        ) {
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

export default RetailRoute;
