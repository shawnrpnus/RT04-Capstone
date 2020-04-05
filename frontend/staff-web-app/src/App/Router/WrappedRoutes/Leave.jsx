import { Switch } from "react-router-dom";
import React from "react";
import LeaveApplicationForm from "../../../components/Leave/components/LeaveApplicationForm";
import SecureRoute from "../SecureRoute";
import LeaveManagerTableContainer from "../../../components/Leave/components/LeaveManagerTableContainer";

export default () => (
    <Switch>
        <SecureRoute
            exact
            path="/leave/apply"
            component={LeaveApplicationForm}
        />

        <SecureRoute
            exact
            path="/leave/manager"
            component={LeaveManagerTableContainer}
        />

    </Switch>
);
