import React, { useEffect, useState } from "react";
// import * as PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import Grid from "@material-ui/core/Grid";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

import withPage from "../../Layout/page/withPage";
import MaterialTextField from "../../../shared/components/Form/MaterialTextField";
import ContentSaveIcon from "mdi-react/ContentSaveIcon";
import CloseCircleIcon from "mdi-react/CloseCircleIcon";
import { ButtonToolbar, Button } from "reactstrap";
import {
  createDiscount,
  updateDiscount,
  retrieveDiscountById
} from "../../../redux/actions/discountActions";
import { clearErrors } from "./../../../redux/actions/index";

const moment = require("moment");
const _ = require("lodash");

const startState = {
  discountId: "",
  discountName: "",
  fromDateTime: moment(new Date())
    .utcOffset(8)
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
  toDateTime: moment(new Date())
    .add(1, "d")
    .utcOffset(8)
    .set({ hour: 23, minute: 59, second: 59, millisecond: 999 }),
  flatDiscount: "",
  percentageDiscount: ""
};

const DiscountForm = props => {
  const dispatch = useDispatch();
  const errors = useSelector(state => state.errors);
  const discount = useSelector(state => state.discount.discount);
  const [state, setState] = useState(startState);
  const [endError, setEndError] = useState(false);
  const [startError, setStartError] = useState(false);
  const discountId = _.get(props, "match.params.discountId", null);
  const {
    discountName,
    fromDateTime,
    toDateTime,
    flatDiscount,
    percentageDiscount
  } = state;

  useEffect(() => {
    if (discountId) {
      dispatch(retrieveDiscountById(discountId));
    }
    if (Object.keys(errors).length !== 0) {
      dispatch(clearErrors());
    }
  }, []);

  useEffect(() => {
    if (discountId && discount) {
      const dist = { ...discount };

      if (!dist.flatDiscount) dist.flatDiscount = "";
      if (!dist.percentageDiscount) dist.percentageDiscount = "";
      else dist.percentageDiscount = dist.percentageDiscount * 100;
      dist.fromDateTime = moment(dist.fromDateTime);
      dist.toDateTime = moment(dist.toDateTime);

      delete dist.products;
      setState(dist);
    }
  }, [discount]);

  const onChange = e => {
    const name = e.target.name;
    const newState = { ...state };
    newState[name] = e.target.value;
    setState(newState); //computed property name syntax
    if (Object.keys(errors).length !== 0) {
      dispatch(clearErrors());
    }
  };

  const onChangeNumber = e => {
    const name = e.target.name;
    const stateValue = state[name];
    let value = e.target.value;
    const lastChar = e.target.value.substr(value.length - 1, 1);
    if (lastChar === "." && !stateValue.includes(".")) {
      // skip the else
    } else {
      const x = e.target.value.split(".");
      if (x[1] && x[1].length >= 2) {
        value = parseFloat(e.target.value)
          .toFixed(2)
          .toString();
      } else {
        value = parseFloat(e.target.value).toString();
      }
      if (value === "NaN") value = "";
    }
    const newState = { ...state };
    newState[name] = value;
    setState(newState);
    if (Object.keys(errors).length !== 0) {
      dispatch(clearErrors());
    }
  };

  const handleDateChange = (input, name) => {
    setEndError(false);
    setStartError(false);
    if (name === "toDateTime") {
      if (fromDateTime.isSameOrAfter(input)) {
        setEndError(true);
        return;
      }
    } else {
      // fromDateTime
      if (input.isSameOrAfter(toDateTime) || input.isBefore(new Date())) {
        setStartError(true);
        return;
      }
    }
    const newState = { ...state };
    const date =
      name === "toDateTime"
        ? input
            .utcOffset(8)
            .set({ hour: 23, minute: 59, second: 59, millisecond: 999 })
        : input
            .utcOffset(8)
            .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    newState[name] = date;
    setState(newState);
  };

  const handleSubmit = e => {
    e.preventDefault();

    const newState = { ...state };
    newState.percentageDiscount = newState.percentageDiscount / 100;
    if (discountId) {
      dispatch(updateDiscount(newState, props.history));
    } else {
      dispatch(createDiscount(newState, props.history));
    }
  };

  const handleReset = () => {
    setState(startState);
    if (Object.keys(errors).length !== 0) {
      dispatch(clearErrors());
    }
  };

  const handleCancel = () => {
    props.history.push("/discount/viewAllDiscounts");
  };

  const enabled = discountName && (flatDiscount || percentageDiscount);

  return (
    <form className="material-form">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <MaterialTextField
            fieldLabel="Discount Name"
            onChange={onChange}
            fieldName="discountName"
            state={state}
            errors={errors}
            autoFocus={true}
          />
        </Grid>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Grid item xs={12} md={3}>
            <KeyboardDatePicker
              className="material-form__field"
              format="DD MMMM YYYY - HH:mm"
              margin="normal"
              variant="dialog"
              inputVariant="standard"
              value={moment(fromDateTime)}
              onChange={date => {
                handleDateChange(date, "fromDateTime");
              }}
            />
            {startError && (
              <small style={{ color: "red" }}>
                Start date must be after today's date and end date
              </small>
            )}
          </Grid>

          <Grid item xs={12} md={3}>
            <KeyboardDatePicker
              className="material-form__field"
              format="DD MMMM YYYY - HH:mm"
              margin="normal"
              variant="dialog"
              inputVariant="standard"
              value={moment(toDateTime)}
              onChange={date => {
                handleDateChange(date, "toDateTime");
              }}
            />
            {endError && (
              <small style={{ color: "red" }}>
                End date must be after start date
              </small>
            )}
          </Grid>
        </MuiPickersUtilsProvider>
        <Grid item xs={12} md={6}>
          <MaterialTextField
            fieldLabel="Flat Discount"
            onChange={onChangeNumber}
            fieldName="flatDiscount"
            state={state}
            errors={errors}
            disabled={percentageDiscount !== ""}
          />
          {!percentageDiscount ? (
            <small>In dollars</small>
          ) : (
            <small style={{ color: "red" }}>Disabled</small>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <MaterialTextField
            fieldLabel="Percentage Discount"
            onChange={onChangeNumber}
            fieldName="percentageDiscount"
            state={state}
            errors={errors}
            disabled={flatDiscount !== ""}
          />
          {!flatDiscount ? (
            <small>In percentage</small>
          ) : (
            <small style={{ color: "red" }}>Disabled</small>
          )}
        </Grid>
      </Grid>

      <ButtonToolbar className="form__button-toolbar">
        <Button
          color="primary"
          className="icon"
          onClick={handleSubmit}
          disabled={!enabled}
        >
          <p>
            <ContentSaveIcon />
            {discountId ? "Update" : "Save"}
          </p>
        </Button>
        <Button
          type="button"
          className="icon"
          onClick={discountId ? handleCancel : handleReset}
        >
          <p>
            <CloseCircleIcon />
            {discountId ? "Cancel" : "Reset"}
          </p>
        </Button>
      </ButtonToolbar>
    </form>
  );
};

export default withPage(DiscountForm, "Promo Code Form");
