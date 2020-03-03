import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useSelector } from "react-redux";

const HRRoute = ({ component: Component, ...rest }) => {
    let authenticated = false;
    let staff = useSelector(state => state.staffEntity.loggedInStaff);

    if (staff) authenticated = true;

    return (
        <Route
            {...rest}
            render={props =>
                (authenticated === true && staff.department.departmentName==="HR")? (
                    <Component {...props} staff={staff} />
                ) :  (authenticated === true && staff.department.departmentName!=="HR")?(
                    <Redirect to="/" />
                ) : (
                    <Redirect to="/login" />
                )

            }
        />
    );
};

export default HRRoute;
