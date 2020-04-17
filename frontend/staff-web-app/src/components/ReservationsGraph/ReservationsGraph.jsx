import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Graph from "./Graph";
import { useDispatch, useSelector } from "react-redux";
import {
  retrieveReservationsByTimeslot,
  retrieveSalesByDay
} from "../../redux/actions/analyticsActions";
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
import StoreInsights from "./StoreInsights";

const moment = require("moment");
const _ = require("lodash");

function ReservationsGraph(props) {
  const dispatch = useDispatch();
  const reservationsByTimeslot = useSelector(
    state => state.analytics.reservationsByTimeslot
  );
  const allStores = useSelector(state => state.storeEntity.allStores);
  const [fromDateMoment, setFromDateMoment] = useState(null);
  const [toDateMoment, setToDateMoment] = useState(null);
  const [initialFromDateMoment, setInitialFromDateMoment] = useState(null);
  const [initialToDateMoment, setInitialToDateMoment] = useState(null);
  const [storeOptions, setStoreOptions] = useState({});
  const [mode, setMode] = useState("combined");
  const [yAxis, setYAxis] = useState("averageReservations");

  useEffect(() => {
    dispatch(retrieveReservationsByTimeslot(null, null, null));
    dispatch(retrieveAllStores());
  }, []);

  useEffect(() => {
    if (
      fromDateMoment !== null &&
      toDateMoment !== null &&
      _.keys(storeOptions).length > 0
    ) {
      setTimeout(() => handleFilter(), 200);
    }
  }, [fromDateMoment, toDateMoment, storeOptions, mode]);

  useEffect(() => {
    if (reservationsByTimeslot) {
      if (fromDateMoment == null) {
        setFromDateMoment(
          moment(reservationsByTimeslot.earliestReservationDate, "YYYY-MM-DD")
        );
        setInitialFromDateMoment(
          moment(reservationsByTimeslot.earliestReservationDate, "YYYY-MM-DD")
        );
      }
      if (toDateMoment == null) {
        setToDateMoment(
          moment(reservationsByTimeslot.latestReservationDate, "YYYY-MM-DD")
        );
        setInitialToDateMoment(
          moment(reservationsByTimeslot.latestReservationDate, "YYYY-MM-DD")
        );
      }
    }
  }, [reservationsByTimeslot]);

  useEffect(() => {
    setInitialOptions();
  }, [allStores]);

  const setInitialOptions = () => {
    if (allStores) {
      const options = {};
      allStores.forEach(store => {
        options[store.storeId] = true;
      });
      setStoreOptions(options);
    }
  };

  const reset = () => {
    setFromDateMoment(initialFromDateMoment);
    setToDateMoment(initialToDateMoment);
    setInitialOptions();
    setMode("combined");
  };

  const handleCheckboxChange = e => {
    setStoreOptions(prevState => {
      return {
        ...prevState,
        [e.target.name]: e.target.checked
      };
    });
  };

  const handleFilter = () => {
    const fromDateString = fromDateMoment.format("YYYY-MM-DD");
    const toDateString = toDateMoment.format("YYYY-MM-DD");
    const storeIds = _.keys(storeOptions).filter(
      key => key !== "online" && storeOptions[key]
    );
    dispatch(
      retrieveReservationsByTimeslot(fromDateString, toDateString, storeIds)
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
                <FormControl>
                  <FormLabel style={{ fontSize: 16, fontWeight: "bold" }}>
                    Store
                  </FormLabel>
                  <FormGroup>
                    {allStores &&
                      _.keys(storeOptions).length === allStores.length && (
                        <>
                          {allStores.map(store => (
                            <FormControlLabel
                              key={store.storeId}
                              control={
                                <Checkbox
                                  checked={storeOptions[store.storeId]}
                                  onChange={handleCheckboxChange}
                                  name={store.storeId.toString()}
                                />
                              }
                              label={store.storeName}
                            />
                          ))}
                        </>
                      )}
                  </FormGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <ButtonGroup color="primary">
                  <MuiButton
                    onClick={() => setMode("combined")}
                    variant={mode === "combined" ? "contained" : "outlined"}
                  >
                    Combined
                  </MuiButton>
                  <MuiButton
                    onClick={() => setMode("separate")}
                    variant={mode === "separate" ? "contained" : "outlined"}
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
                    <MenuItem value={"averageReservations"}>
                      Average Reservations
                    </MenuItem>
                    <MenuItem value={"totalReservations"}>
                      Total Reservations
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
          storeOptions={{ ...storeOptions }}
          mode={mode}
          allStores={allStores}
          yAxis={yAxis}
        />
      </Grid>
      {allStores && reservationsByTimeslot &&
      <Grid item xs={12}>
        <h4 style={{ fontWeight: "bold" }}>Insights</h4>
        {allStores.map(store => (
          <StoreInsights store={store} reservationsByTimeSlotData={reservationsByTimeslot.result}/>
        ))}
      </Grid>
      }
    </Grid>
  );
}



export default withPage(ReservationsGraph, "Reservations By Time Slot");
