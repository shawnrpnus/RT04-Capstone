import { Switch } from "react-router-dom";
import React from "react";
import LeaveApplicationForm from "../../../components/Leave/components/LeaveApplicationForm";
import SecureRoute from "../SecureRoute";

export default () => (
    <Switch>
        <SecureRoute
            exact
            path="/leave/apply"
            component={LeaveApplicationForm}
        />
    </Switch>
);