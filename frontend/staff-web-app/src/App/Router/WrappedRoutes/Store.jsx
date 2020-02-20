import React from "react";
import {Route, Switch} from "react-router-dom";
import {StoreFormContainer} from "../../../components/Store";

export default () => (
    <Switch>
        <Route
            exact
            path="/store/create"
            render={props => <StoreFormContainer {...props} mode="create"/>}
        />
        <Route
            exact
            path="/store/view/:storeId"
            render={props => <StoreFormContainer {...props} mode="view"/>}
        />
        <Route
            exact
            path="/store/update/:storeId"
            render={props => <StoreFormContainer {...props} mode="update"/>}
        />
    </Switch>
);

