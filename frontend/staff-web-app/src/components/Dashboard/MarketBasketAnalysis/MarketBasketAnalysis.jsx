import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BasketCard from "./components/BasketCard";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { retrieveMarketBasketAnalysisResult } from "../../../redux/actions/dashboardActions";

const useStyles = makeStyles({
  card: {
    textAlign: "center",
    height: "70vh",
    overflowY: "scroll"
  }
});

const MarketBasketAnalysis = props => {
  const dispatch = useDispatch();
  const basket = useSelector(state => state.dashboard.basket);
  const classes = useStyles();

  useEffect(() => {
    dispatch(retrieveMarketBasketAnalysisResult());
  }, []);

  return (
    <Card className={classes.card}>
      <Typography style={{ marginTop: "2%", fontWeight: "bold" }}>
        Market Basket Analysis
      </Typography>
      <CardContent>
        {basket.map((e, index) => {
          return (
            <React.Fragment key={index}>
              <BasketCard products={e} />
              <Divider style={{ margin: "2%" }} />
            </React.Fragment>
          );
        })}
        {basket.length < 1 && `No constructive analysis can be made yet`}
      </CardContent>
    </Card>
  );
};

export default MarketBasketAnalysis;
