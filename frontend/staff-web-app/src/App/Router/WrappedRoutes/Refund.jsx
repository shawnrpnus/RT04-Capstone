import RetailRoute from "../RetailRoute";
import React from "react";
import CreateEditRefundRecord from "../../../components/Refund/CreateEditRefundRecord";
import { Route, Switch } from "react-router-dom";
import ViewRefundRecordDetails from "../../../components/Refund/ViewRefundRecordDetails";
import ViewAllRefundRecords from "../../../components/Refund/ViewAllRefundRecords";
import UpdateRefundRecordDetails from "../../../components/Refund/UpdateRefundRecordDetails";

export default () => (
  <Switch>
    <RetailRoute
      exact
      path="/refund/createRefundRecord"
      component={CreateEditRefundRecord}
    />
    <RetailRoute
      exact
      path="/refund/viewRefundRecord/:refundId"
      component={ViewRefundRecordDetails}
    />
      <RetailRoute
        exact
        path="/refund/updateRefundRecord/:refundId"
        component={UpdateRefundRecordDetails}
      />
    <RetailRoute
      exact
      path="/refund/viewAllRefunds"
      component={ViewAllRefundRecords}
    />
  </Switch>
);
