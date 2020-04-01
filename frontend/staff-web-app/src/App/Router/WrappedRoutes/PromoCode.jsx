import { Switch } from "react-router-dom";
import React from "react";
import SalesMarketingRoute from "../SalesMarketingRoute";
import PromoCodeCreateForm from "../../../components/PromoCode/components/PromoCodeCreateForm";
import PromoCodeTable from "../../../components/PromoCode/components/PromoCodeTable";
import PromoCodeUpdateForm from "../../../components/PromoCode/components/PromoCodeUpdateForm";

export default () => (
  <Switch>
    <SalesMarketingRoute
      exact
      path="/promoCode/create"
      component={PromoCodeCreateForm}
    />
    <SalesMarketingRoute
      exact
      path="/promoCode/viewAll"
      component={PromoCodeTable}
    />
    <SalesMarketingRoute
      path="/promoCode/update/:promoCodeId"
      component={PromoCodeUpdateForm}
    />
  </Switch>
);
