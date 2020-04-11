import { Switch } from "react-router-dom";
import React from "react";
import SecureRoute from "../SecureRoute";
import CreatePayrollsForm from "../../../components/Payroll/components/CreatePayrollsForm";

export default () => (
    <Switch>
        <SecureRoute
            exact
            path="/payrolls/createPayrolls"
            component={CreatePayrollsForm}
        />

    </Switch>
);
