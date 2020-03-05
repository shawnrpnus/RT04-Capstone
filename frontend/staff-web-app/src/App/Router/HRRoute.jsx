import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import SecureRoute from "./SecureRoute";

const HRRoute = ({ component: Component, ...rest }) => {
  let authenticated = false;
  let staff = useSelector(state => state.staffEntity.loggedInStaff);
  let store = useSelector(state => state.storeEntity.selectedStore);

  if (staff) authenticated = true;

  return (
    <SecureRoute
      {...rest}
      render={props => {
        if (staff.department.departmentName === "HR") {
          return <Component {...props} store={store} />;
        }

        return <Redirect to="/" />;
      }}
    />
  );
};

export default HRRoute;
