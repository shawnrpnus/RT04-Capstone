import React from "react";
import { Route, Switch } from "react-router-dom";
<<<<<<< HEAD
import StaffFormContainer from "../../../components/Staff/components/StaffFormContainer";
import StaffAccountFormContainer from "../../../components/Staff/components/StaffAccountFormContainer";

export default () => (
    <Switch>
        <Route
            exact
            path="/staff/create"
            render={props => <StaffFormContainer {...props} mode="create" />}
        />
        <Route
            exact
            path="/staff/createAccount"
            render={props => <StaffAccountFormContainer {...props} mode="create" />}
        />
    </Switch>
);
=======
>>>>>>> 9dd63a077525cb0b1e6a0301247efd35ff001954
