import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import withPage from "../Layout/page/withPage";
import Grid from "@material-ui/core/Grid";
import MarketBasketAnalysis from "./MarketBasketAnalysis/MarketBasketAnalysis";

const Dashboard = props => {
  return (
    <>
      <Grid container>
        <Grid item xs={12} md={4}></Grid>
        <Grid item xs={12} md={8}>
          <MarketBasketAnalysis />
        </Grid>
      </Grid>
    </>
  );
};

export default withPage(Dashboard, "Dashboard");
