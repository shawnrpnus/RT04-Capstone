import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Graph from "./Graph";
import { useDispatch, useSelector } from "react-redux";
import { retrieveSalesByDay } from "../../redux/actions/analyticsActions";
import withPage from "../Layout/page/withPage";
import MomentUtils from "@date-io/moment";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import { Button } from "reactstrap";
import FilterIcon from "mdi-react/FilterIcon";
import { retrieveAllStores } from "../../redux/actions/storeActions";
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button as MuiButton,
  Select,
  MenuItem,
  InputLabel
} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Divider from "@material-ui/core/Divider";

const moment = require("moment");
const _ = require("lodash");

function SalesGraph(props) {
  const dispatch = useDispatch();
  const salesByDay = useSelector(state => state.analytics.salesByDay);
  const allStores = useSelector(state => state.storeEntity.allStores);
  const [fromDateMoment, setFromDateMoment] = useState(null);
  const [toDateMoment, setToDateMoment] = useState(null);
  const [initialFromDateMoment, setInitialFromDateMoment] = useState(null);
  const [initialToDateMoment, setInitialToDateMoment] = useState(null);
  const [popOptions, setPopOptions] = useState({});
  const [lineMode, setLineMode] = useState("combined");
  const [yAxis, setYAxis] = useState("averageTotalSales");

  useEffect(() => {
    dispatch(retrieveSalesByDay(null, null, null, null));
    dispatch(retrieveAllStores());
  }, []);

  useEffect(() => {
    if (
      fromDateMoment !== null &&
      toDateMoment !== null &&
      _.keys(popOptions).length > 0
    ) {
      setTimeout(() => handleFilter(), 200);
    }
  }, [fromDateMoment, toDateMoment, popOptions, lineMode]);

  useEffect(() => {
    if (salesByDay) {
      if (fromDateMoment == null) {
        setFromDateMoment(moment(salesByDay[0].date, "YYYY-MM-DD"));
        setInitialFromDateMoment(moment(salesByDay[0].date, "YYYY-MM-DD"));
      }
      if (toDateMoment == null) {
        setToDateMoment(
          moment(salesByDay[salesByDay.length - 1].date, "YYYY-MM-DD")
        );
        setInitialToDateMoment(
          moment(salesByDay[salesByDay.length - 1].date, "YYYY-MM-DD")
        );
      }
    }
  }, [salesByDay]);

  useEffect(() => {
    setInitialOptions();
  }, [allStores]);

  const setInitialOptions = () => {
    if (allStores) {
      const options = {};
      allStores.forEach(store => {
        options[store.storeId] = true;
      });
      options.online = true;
      setPopOptions(options);
    }
  };

  const reset = () => {
    setFromDateMoment(initialFromDateMoment);
    setToDateMoment(initialToDateMoment);
    setInitialOptions();
    setLineMode("combined");
  };

  const handleCheckboxChange = e => {
    setPopOptions(prevState => {
      return {
        ...prevState,
        [e.target.name]: e.target.checked
      };
    });
  };

  const handleFilter = () => {
    const fromDateString = fromDateMoment.format("YYYY-MM-DD");
    const toDateString = toDateMoment.format("YYYY-MM-DD");
    const storeIds = _.keys(popOptions).filter(
      key => key !== "online" && popOptions[key]
    );
    const onlineSelected = popOptions.online;
    dispatch(
      retrieveSalesByDay(fromDateString, toDateString, storeIds, onlineSelected)
    );
  };

  return (
    <Grid container>
      <Grid item xs={12} md={3}>
        {fromDateMoment && toDateMoment && (
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <form className="material-form">
              <Grid container spacing={3}>
                <Grid
                  item
                  container
                  row
                  xs={12}
                  style={{ alignItems: "center" }}
                >
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
                <FormControl>
                  <FormLabel style={{ fontSize: 16, fontWeight: "bold" }}>
                    Point of Purchase
                  </FormLabel>
                  <FormGroup>
                    {allStores &&
                      _.keys(popOptions).length === allStores.length + 1 && (
                        <>
                          {allStores.map(store => (
                            <FormControlLabel
                              key={store.storeId}
                              control={
                                <Checkbox
                                  checked={popOptions[store.storeId]}
                                  onChange={handleCheckboxChange}
                                  name={store.storeId.toString()}
                                />
                              }
                              label={store.storeName}
                            />
                          ))}
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={popOptions.online}
                                onChange={handleCheckboxChange}
                                name={"online"}
                              />
                            }
                            label={"Online"}
                          />
                        </>
                      )}
                  </FormGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <ButtonGroup color="primary">
                  <MuiButton
                    onClick={() => setLineMode("combined")}
                    variant={lineMode === "combined" ? "contained" : "outlined"}
                  >
                    Combined
                  </MuiButton>
                  <MuiButton
                    onClick={() => setLineMode("separate")}
                    variant={lineMode === "separate" ? "contained" : "outlined"}
                  >
                    Separate
                  </MuiButton>
                </ButtonGroup>
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
                    <MenuItem value={"averageTotalSales"}>
                      Average Sales ($)
                    </MenuItem>
                    <MenuItem value={"totalSales"}>Total Sales ($)</MenuItem>
                    <MenuItem value={"totalTransactions"}>
                      Number of Transactions
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
          popOptions={{ ...popOptions }}
          lineMode={lineMode}
          allStores={allStores}
          yAxis={yAxis}
        />
      </Grid>
    </Grid>
  );
}

export default withPage(SalesGraph, "Sales Performance");
