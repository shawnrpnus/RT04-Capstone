import { Switch } from "react-router-dom";
import React from "react";
import LeaveApplicationForm from "../../../components/Leave/components/LeaveApplicationForm";
import SecureRoute from "../SecureRoute";
import LeaveManagerTableContainer from "../../../components/Leave/components/LeaveManagerTableContainer";
import LeaveHrTableContainer from "../../../components/Leave/components/LeaveHrTableContainer";

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

        <SecureRoute
            exact
            path="/leave/hr"
            component={LeaveHrTableContainer}
        />

    </Switch>
);
