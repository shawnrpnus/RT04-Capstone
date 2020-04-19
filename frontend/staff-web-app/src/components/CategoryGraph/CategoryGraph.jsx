import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Graph from "./Graph";
import { useDispatch, useSelector } from "react-redux";
import { retrieveSalesByCategory, retrieveSalesByDay } from "../../redux/actions/analyticsActions";
import withPage from "../Layout/page/withPage";
import MomentUtils from "@date-io/moment";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Button as MuiButton, MenuItem, Select } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

const moment = require("moment");
const _ = require("lodash");

function CategoryGraph(props) {
  const dispatch = useDispatch();
  const salesByCategory = useSelector(state => state.analytics.salesByCategory);

  const [fromDateMoment, setFromDateMoment] = useState(null);
  const [toDateMoment, setToDateMoment] = useState(null);
  const [initialFromDateMoment, setInitialFromDateMoment] = useState(null);
  const [initialToDateMoment, setInitialToDateMoment] = useState(null);
  const [yAxis, setYAxis] = useState("revenue");

  useEffect(() => {
    dispatch(retrieveSalesByCategory(null, null));
  }, []);

  useEffect(() => {
    if (
      fromDateMoment !== null &&
      toDateMoment !== null
    ) {
      setTimeout(() => handleFilter(), 200);
    }
  }, [fromDateMoment, toDateMoment]);

  useEffect(() => {
    if (salesByCategory) {
      if (fromDateMoment == null) {
        setFromDateMoment(
          moment(salesByCategory.earliestTransactionDate, "YYYY-MM-DD")
        );
        setInitialFromDateMoment(
          moment(salesByCategory.earliestTransactionDate, "YYYY-MM-DD")
        );
      }
      if (toDateMoment == null) {
        setToDateMoment(
          moment(salesByCategory.latestTransactionDate, "YYYY-MM-DD")
        );
        setInitialToDateMoment(
          moment(salesByCategory.latestTransactionDate, "YYYY-MM-DD")
        );
      }
    }
  }, [salesByCategory]);

  const reset = () => {
    setFromDateMoment(initialFromDateMoment);
    setToDateMoment(initialToDateMoment);
  };

  const handleFilter = () => {
    const fromDateString = fromDateMoment.format("YYYY-MM-DD");
    const toDateString = toDateMoment.format("YYYY-MM-DD");
    dispatch(
      retrieveSalesByCategory(fromDateString, toDateString)
    );
  };

  return (
    <Grid container>
      <Grid item xs={12} md={3}>
        {fromDateMoment && toDateMoment && (
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <form className="material-form">
              <Grid container spacing={3}>
                <Grid item container xs={12} style={{ alignItems: "center" }}>
                  <Grid item xs={8}>
                    <h4 style={{ fontWeight: "bold" }}>Filter</h4>
                  </Grid>
                  <Grid item xs={4}>
                    <MuiButton
                      variant="contained"
                      color="secondary"
                      onClick={reset}
                    >
                      Reset
                    </MuiButton>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <div className="material-form__label">Start Date</div>
                  <KeyboardDatePicker
                    className="material-form__field"
                    margin="normal"
                    variant="dialog"
                    inputVariant="standard"
                    value={fromDateMoment}
                    maxDate={toDateMoment}
                    onChange={date => {
                      setFromDateMoment(date);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <div className="material-form__label">End Date</div>
                  <KeyboardDatePicker
                    className="material-form__field"
                    margin="normal"
                    variant="dialog"
                    inputVariant="standard"
                    value={toDateMoment}
                    disableFuture
                    onChange={date => {
                      setToDateMoment(date);
                    }}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} style={{ marginTop: 20 }}>
                <FormControl variant="outlined" style={{ width: "95%" }}>
                  <FormLabel style={{ fontSize: 16, fontWeight: "bold" }}>
                    Y-Axis
                  </FormLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={yAxis}
                    onChange={e => setYAxis(e.target.value)}
                    style={{ width: "100%" }}
                  >
                    <MenuItem value={"revenue"}>
                      Revenue ($)
                    </MenuItem>
                    <MenuItem value={"numPurchases"}>
                      Number of Purchases
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </form>
          </MuiPickersUtilsProvider>
        )}
      </Grid>
      <Grid item xs={12} md={9}>
        <Graph
          yAxis={yAxis}
        />
      </Grid>
    </Grid>
  );
}



export default withPage(CategoryGraph, "Sales Performance by Category");
