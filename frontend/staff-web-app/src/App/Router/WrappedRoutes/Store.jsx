import React from 'react';
import { Route, Switch } from 'react-router-dom';
import StoreEdit from "../../../components/Store";

export default () => (
    <Switch>
        <Route exact path="/store/edit" component={StoreEdit} />
    </Switch>
);
