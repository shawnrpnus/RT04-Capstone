import React, { useEffect, useState } from "react";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import ContentSaveIcon from "mdi-react/ContentSaveIcon";
import { Button } from "reactstrap";
import FilterIcon from "mdi-react/FilterIcon";
import { retrieveSalesByDay } from "../../redux/actions/analyticsActions";

const moment = require("moment");

function FilterBar(props){
  const dispatch = useDispatch();
  const salesByDay = useSelector(state => state.analytics.salesByDay);
  const [fromDateMoment, setFromDateMoment] = useState(null);
  const [toDateMoment, setToDateMoment] = useState(null);

  useEffect(() => {
    if (salesByDay) {
      if (fromDateMoment == null) {
        setFromDateMoment(moment(salesByDay[0].date, "YYYY-MM-DD"));
      }
      if (toDateMoment == null) {
        setToDateMoment(moment(salesByDay[salesByDay.length - 1].date, "YYYY-MM-DD"));
      }
    }
  }, [salesByDay]);

  const handleFilter = (e) => {
    e.preventDefault();
    const fromDateString = fromDateMoment.format("YYYY-MM-DD");
    const toDateString = toDateMoment.format("YYYY-MM-DD")
    dispatch(retrieveSalesByDay(fromDateString, toDateString, null));

  }

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      {fromDateMoment && toDateMoment && (
        <form className="material-form">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <h4>Filter</h4>
            </Grid>
            <Grid item xs={12}>
              <div className="material-form__label">Start Date</div>
              <KeyboardDatePicker
                classname="material-form__field"
                margin="normal"
                variant="dialog"
                inputVariant="standard"
                value={fromDateMoment}
                onChange={date => {
                  setFromDateMoment(date);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <div className="material-form__label">End Date</div>
              <KeyboardDatePicker
                classname="material-form__field"
                margin="normal"
                variant="dialog"
                inputVariant="standard"
                value={toDateMoment}
                onChange={date => {
                  setToDateMoment(date);
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button
              color="primary"
              className="icon"
              onClick={handleFilter}
            >
              <p>
                <FilterIcon />
                Filter
              </p>
            </Button>
          </Grid>
        </form>
      )}
    </MuiPickersUtilsProvider>
  );
}

export default FilterBar;
