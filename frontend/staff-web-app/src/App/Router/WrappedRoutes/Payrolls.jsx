import { Switch } from "react-router-dom";
import React from "react";
import SecureRoute from "../SecureRoute";
import CreatePayrollsForm from "../../../components/Payroll/components/CreatePayrollsForm";
import ViewAllPayrollsHR from "../../../components/Payroll/components/ViewAllPayrollsHR";

export default () => (
    <Switch>
        <SecureRoute
            exact
            path="/payrolls/createPayrolls"
            component={CreatePayrollsForm}
        />

        <SecureRoute
            exact
            path="/payrolls/viewAllHR"
            component={ViewAllPayrollsHR}
        />

    </Switch>
);
