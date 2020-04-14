import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Graph from "./Graph";
import { useDispatch } from "react-redux";
import { retrieveSalesByDay } from "../../redux/actions/analyticsActions";
import withPage from "../Layout/page/withPage";
import FilterBar from "./FilterBar";

function SalesGraph(props) {
  const dispatch = useDispatch();
  const [fromDateString, setFromDateString] = useState(null);
  const [toDateString, setToDateString] = useState(null);
  const [fromStoreIds, setFromStoreIds] = useState(null);

  useEffect(() => {
    dispatch(retrieveSalesByDay(null, null, null))
  },[])

  return (
    <Grid container>
      <Grid item xs={12} md={3}>
        <FilterBar/>
      </Grid>
      <Grid item xs={12} md={9}>
        <Graph/>
      </Grid>
    </Grid>
  );
}

export default withPage(SalesGraph, "Sales Performance");
