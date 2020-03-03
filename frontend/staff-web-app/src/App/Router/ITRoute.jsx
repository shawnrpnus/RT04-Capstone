import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useSelector } from "react-redux";

const ITRoute = ({ component: Component, ...rest }) => {
    let authenticated = false;
    let staff = useSelector(state => state.staffEntity.loggedInStaff);

    if (staff) authenticated = true;

    return (
        <Route
            {...rest}
            render={props =>
                (authenticated === true && staff.department.departmentName==="IT")? (
                    <Component {...props} staff={staff} />
                ) :  (authenticated === true && staff.department.departmentName!=="IT")?(
                    <Redirect to="/" />
                ) : (
                    <Redirect to="/login" />
                )

            }
        />
    );
};

export default ITRoute;
