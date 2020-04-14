import React from "react";
import withPage from "../Layout/page/withPage";
import Grid from "@material-ui/core/Grid";
import MarketBasketAnalysis from "./MarketBasketAnalysis/MarketBasketAnalysis";
import LowStockAlert from "./ProductStock/LowStockAlert";

const Dashboard = props => {
  const department = props.staff.department.departmentName;

  const storeandwarehouse =
    department === "Store" || department === "Warehouse";
  const salesmarketing = department === "Sales and Marketing";
  return (
    <>
      <Grid container spacing={2}>
        {storeandwarehouse && (
          <Grid item xs={12} md={4}>
            <LowStockAlert store={props.staff.store} />
          </Grid>
        )}
        {salesmarketing && (
          <Grid item xs={12} md={8}>
            <MarketBasketAnalysis />
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default withPage(Dashboard, "Dashboard");
