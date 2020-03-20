import {Switch} from "react-router-dom";
import React from "react";
import RetailRoute from "../RetailRoute";
import PromoCodeCreateForm from "../../../components/PromoCode/components/PromoCodeCreateForm";
import PromoCodeTable from "../../../components/PromoCode/components/PromoCodeTable";

export default () => (
    <Switch>
        <RetailRoute
            exact
            path="/promoCode/create"
            component={PromoCodeCreateForm}
        />

        <RetailRoute
            exact
            path="/promoCode/viewAll"
            component={PromoCodeTable}
        />
    </Switch>
)