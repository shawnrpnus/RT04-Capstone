import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import SecureRoute from "./SecureRoute";

const RetailRoute = ({ component: Component, render, ...rest }) => {
  let staff = useSelector(state => state.staffEntity.loggedInStaff);
  let store = useSelector(state => state.storeEntity.selectedStore);

  return (
    <SecureRoute
      {...rest}
      render={props => {
        if (staff.department.departmentName === "Retail") {
          return Component ? (
            <Component {...props} store={store} />
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
