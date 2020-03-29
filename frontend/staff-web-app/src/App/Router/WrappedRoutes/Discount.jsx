import React from "react";
import { Route, Switch } from "react-router-dom";
import {
  DiscountForm,
  DiscountAssociationTable,
  DiscountManagementTable
} from "../../../components/Discount";
import SalesMarketingRoute from "../SalesMarketingRoute";

export default () => (
  <Switch>
    <SalesMarketingRoute
      exact
      path="/discount/discountForm"
      component={DiscountForm}
    />
    <SalesMarketingRoute
      exact
      path="/discount/discountForm/:discountId"
      component={DiscountForm}
    />
    <SalesMarketingRoute
      exact
      path="/discount/associateProducts"
      component={DiscountAssociationTable}
    />
    <SalesMarketingRoute
      exact
      path="/discount/viewAllDiscounts"
      component={DiscountManagementTable}
    />
  </Switch>
);
