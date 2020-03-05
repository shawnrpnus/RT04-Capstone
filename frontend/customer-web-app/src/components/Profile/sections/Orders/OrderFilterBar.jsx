import React, { useEffect, useState } from "react";
import CardBody from "components/UI/Card/CardBody";
import Tooltip from "@material-ui/core/Tooltip";
import Clearfix from "components/UI/Clearfix/Clearfix";
import Accordion from "components/UI/Accordion/Accordion";
import Card from "components/UI/Card/Card";
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/material-kit-pro-react/views/ecommerceSections/productsStyle";
import selectStyles from "assets/jss/material-kit-pro-react/customSelectStyle.js";
import classNames from "classnames";
import Slider from "@material-ui/core/Slider";
import CheckboxGroup from "components/UI/CheckboxGroup/CheckboxGroup";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Fab from "@material-ui/core/Fab";
import { Publish, RotateLeft } from "@material-ui/icons";
import Link from "@material-ui/core/Link";
import { useDispatch, useSelector } from "react-redux";
import { filterProducts } from "redux/actions/productActions";
import {
  setOrderCollectionMode,
  setOrderDeliveryStatus,
  setOrderEndDate,
  setOrderSelectedSort,
  setOrderStartDate
} from "redux/actions/filterBarActions";
import FilterTransactionRequest from "models/customer/FilterTransactionRequest";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { filterTransactions } from "redux/actions/transactionActions";

const _ = require("lodash");
const moment = require("moment");
const useStyles = makeStyles(styles);
const useSelectStyles = makeStyles(selectStyles);

function OrderFilterBar(props) {
  const classes = useStyles();
  const selectClasses = useSelectStyles();
  const { customerId, setFilterDrawerOpen, setIsLoading } = props;

  const dispatch = useDispatch();
  const customer = useSelector(state => state.customer.loggedInCustomer);

  const sortingMap = {
    "Date (Newest First)": "DATE_NEWEST_FIRST",
    "Date (Oldest First)": "DATE_OLDEST_FIRST",
    "Amount (Low to High)": "PRICE_LOW_TO_HIGH",
    "Amount (High To Low)": "PRICE_HIGH_TO_LOW"
  };

  const sortingOptions = Object.keys(sortingMap);

  const collectionModeMap = {
    Delivery: "DELIVERY",
    "In Store Collection": "IN_STORE",
    Any: null
  };

  const collectionModeOptions = Object.keys(collectionModeMap);

  const deliveryStatusMap = {
    Processing: "PROCESSING",
    "In Transit": "IN_TRANSIT",
    Delivered: "DELIVERED",
    Any: null
  };

  const deliveryStatusOptions = Object.keys(deliveryStatusMap);

  const orderStartDate = useSelector(state => state.filterBar.orderStartDate);
  const orderEndDate = useSelector(state => state.filterBar.orderEndDate);
  const orderCollectionMode = useSelector(
    state => state.filterBar.orderCollectionMode
  );
  const orderDeliveryStatus = useSelector(
    state => state.filterBar.orderDeliveryStatus
  );
  const orderSelectedSort = useSelector(
    state => state.filterBar.orderSelectedSort
  );

  useEffect(() => {
    if (orderStartDate === null) {
      dispatch(setOrderStartDate(moment(customer.createdDateTime)));
    }
    if (orderEndDate === null) {
      dispatch(setOrderEndDate(moment()));
    }
    if (orderCollectionMode === null) {
      dispatch(setOrderCollectionMode("Any"));
    }
    if (orderDeliveryStatus === null) {
      dispatch(setOrderDeliveryStatus("Any"));
    }
    if (orderSelectedSort === null) {
      dispatch(setOrderSelectedSort(Object.keys(sortingMap)[0]));
    }
  });

  const resetFilter = () => {
    dispatch(setOrderStartDate(moment(customer.createdDateTime)));
    dispatch(setOrderEndDate(moment()));
    dispatch(setOrderCollectionMode("Any"));
    dispatch(setOrderDeliveryStatus("Any"));
    dispatch(setOrderSelectedSort(Object.keys(sortingMap)[0]));
    const req = new FilterTransactionRequest(
      customerId,
      null,
      null,
      null,
      null,
      sortingMap[Object.keys(sortingMap)[0]]
    );
    setIsLoading(true);
    dispatch(filterTransactions(req, setFilterDrawerOpen, setIsLoading));
  };

  const handleSubmit = () => {
    const startDateString = orderStartDate.format("YYYY-MM-DD") + " 00:00:00";
    const endDateString = orderEndDate.format("YYYY-MM-DD") + " 23:59:59";
    const req = new FilterTransactionRequest(
      customerId,
      collectionModeMap[orderCollectionMode],
      deliveryStatusMap[orderDeliveryStatus],
      startDateString,
      endDateString,
      sortingMap[orderSelectedSort]
    );
    setIsLoading(true);
    dispatch(filterTransactions(req, setFilterDrawerOpen, setIsLoading));
  };

  return (
    orderSelectedSort && (
      <Card plain>
        <Fab
          color="secondary"
          variant="extended"
          className={classes.floatingFilterDrawer}
          onClick={handleSubmit}
        >
          <Publish /> Submit
        </Fab>
        <CardBody className={classes.cardBodyRefine}>
          <h4 className={classes.cardTitle + " " + classes.textLeft}>
            Sort By
          </h4>
          <FormControl fullWidth className={selectClasses.selectFormControl}>
            <Select
              id="sort-select"
              value={orderSelectedSort}
              onChange={e => dispatch(setOrderSelectedSort(e.target.value))}
            >
              {sortingOptions.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <h4 className={classes.cardTitle + " " + classes.textLeft}>
            Filter by
            <Tooltip
              id="tooltip-top"
              title="Reset Filter"
              placement="top"
              classes={{ tooltip: classes.tooltip }}
            >
              <Link
                component="button"
                variant="body2"
                onClick={resetFilter}
                style={{ float: "right" }}
              >
                <h4 className={classes.reset}>Reset</h4>
              </Link>
            </Tooltip>
            <Clearfix />
          </h4>
          <Accordion
            activeColor="rose"
            collapses={[
              {
                title: "Date Range",
                key: "Date Range",
                content: (
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardDatePicker
                      disableToolbar
                      fullWidth
                      format="DD-MMM-YYYY"
                      variant="inline"
                      margin="normal"
                      label="Start date"
                      value={orderStartDate}
                      maxDate={orderEndDate}
                      onChange={date => {
                        dispatch(setOrderStartDate(date));
                      }}
                    />
                    <KeyboardDatePicker
                      disableToolbar
                      fullWidth
                      format="DD-MMM-YYYY"
                      variant="inline"
                      margin="normal"
                      label="End date"
                      value={orderEndDate}
                      minDate={orderStartDate}
                      onChange={date => {
                        dispatch(setOrderEndDate(date));
                      }}
                      disableFuture
                    />
                  </MuiPickersUtilsProvider>
                )
              },
              {
                title: "Collection Mode",
                key: "Collection Mode",
                content: (
                  <Select
                    id="collection-select"
                    value={orderCollectionMode}
                    fullWidth
                    onChange={e =>
                      dispatch(setOrderCollectionMode(e.target.value))
                    }
                  >
                    {collectionModeOptions.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                )
              },
              {
                title: "Delivery Status",
                key: "Delivery select",
                content: (
                  <Select
                    id="deliver-status-select"
                    value={orderDeliveryStatus}
                    fullWidth
                    onChange={e =>
                      dispatch(setOrderDeliveryStatus(e.target.value))
                    }
                  >
                    {deliveryStatusOptions.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                )
              }
            ]}
          />
        </CardBody>
      </Card>
    )
  );
}

export default OrderFilterBar;
