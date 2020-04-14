import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import MarketBasketAnalysis from "../MarketBasketAnalysis/MarketBasketAnalysis";
import Graph from "./Graph";
import { useDispatch } from "react-redux";
import { retrieveAllTransaction } from "../../../redux/actions/transactionActions";

function SalesGraph(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(retrieveAllTransaction())
  },[])

  return (
    <Grid container>
      <Grid item xs={12} md={12}>
        <Graph/>
      </Grid>
    </Grid>
  );
}

export default SalesGraph;
