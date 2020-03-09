import React, { useEffect, useState } from "react";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import GridItem from "components/Layout/components/Grid/GridItem";
import { makeStyles } from "@material-ui/core/styles";
import wishlistStyle from "assets/jss/material-kit-pro-react/views/wishlistStyle";
import { useDispatch, useSelector } from "react-redux";
import {
  createReservation,
  getAvailSlotsForStore,
  getProductVariantStoreStockStatusForCart,
  retrieveReservationById,
  retrieveStoresWithStockStatusForCart,
  updateReservation
} from "redux/actions/reservationActions";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import StoreCard from "components/Reservation/ReservationBooking/StoreCard";
import customSelectStyle from "assets/jss/material-kit-pro-react/customSelectStyle";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { Button } from "components/UI/CustomButtons/Button";
import { useSnackbar } from "notistack";
import { useParams, useHistory } from "react-router-dom";

const _ = require("lodash");
const useStyles = makeStyles(wishlistStyle);
const useSelectStyles = makeStyles(customSelectStyle);
const moment = require("moment");

function ReservationBooking(props) {
  //Hooks
  const classes = useStyles();
  const { mode } = useParams();
  const history = useHistory();
  const selectClasses = useSelectStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  //Redux
  const dispatch = useDispatch();
  const customer = useSelector(state => state.customer.loggedInCustomer);
  const availSlotsForStore = useSelector(
    state => state.reservation.availSlotsForStore
  );
  const storesWithStockStatus = useSelector(
    state => state.reservation.storesWithStockStatus
  );

  //State
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [selectedTimeslot, setSelectedTimeslot] = useState("");

  //Effects
  useEffect(() => {
    if (customer.customerId) {
      dispatch(retrieveStoresWithStockStatusForCart(customer.customerId));
    }
  }, []);

  const onSelectStore = e => {
    setSelectedStoreId(e.target.value);
    dispatch(
      getProductVariantStoreStockStatusForCart(
        customer.customerId,
        e.target.value
      )
    );
    dispatch(getAvailSlotsForStore(e.target.value));
  };

  const makeReservation = () => {
    const { customerId, email } = customer;
    if (mode === "cart") {
      dispatch(
        createReservation(
          customerId,
          selectedStoreId,
          selectedTimeslot,
          email,
          enqueueSnackbar,
          history
        )
      );
    }
  };

  //check if store is fully stocked to allow making reservation
  const fullyStocked =
    _.get(
      _.keyBy(storesWithStockStatus, "store.storeId"),
      `${selectedStoreId}.stockStatus`
    ) === "In stock";

  return (
    <React.Fragment>
      <h3 className={classes.title} style={{ margin: "5px 0 20px 0" }}>
        Make a Reservation
      </h3>
      <h5>
        Note: Reservations can only be made between 1 and 48 hours in advance.
      </h5>
      <GridContainer>
        <GridItem md={12} sm={12}>
          {/*<Button*/}
          {/*  color="primary"*/}
          {/*  style={{ marginBottom: "20px" }}*/}
          {/*  onClick={() => setMode("choose")}*/}
          {/*>*/}
          {/*  Choose a store*/}
          {/*</Button>*/}
          {/*<Button color="primary" style={{ marginBottom: "20px" }}>*/}
          {/*  Find me a store*/}
          {/*</Button>*/}

          {/*Store picker, same ofor create update, but load with value in state*/}
          <FormControl fullWidth className={selectClasses.selectFormControl}>
            <InputLabel>Select a store</InputLabel>
            <Select onChange={onSelectStore} value={selectedStoreId}>
              {storesWithStockStatus &&
                storesWithStockStatus.map(storeWithStock => (
                  <MenuItem
                    key={storeWithStock.store.storeId}
                    value={storeWithStock.store.storeId}
                    style={{ padding: "0" }}
                  >
                    <StoreCard storeWithStock={storeWithStock} />
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </GridItem>
        <GridItem md={12} sm={12}>
          {/*Time slot picker, same for create/update but load with value in state*/}
          <FormControl fullWidth className={selectClasses.selectFormControl}>
            {availSlotsForStore && (
              <React.Fragment>
                <InputLabel>Select an available time slot</InputLabel>
                <Select
                  onChange={e => setSelectedTimeslot(e.target.value)}
                  value={selectedTimeslot}
                  displayEmpty={true}
                  renderValue={value => {
                    if (availSlotsForStore.length === 0) {
                      return "No time slots available";
                    } else if (value === "") {
                      return null;
                    } else {
                      return moment(value).format("D MMM h:mm A");
                    }
                  }}
                >
                  {availSlotsForStore.map(slot => (
                    <MenuItem key={slot} value={slot}>
                      {moment(slot).format("D MMM h:mm A")}
                    </MenuItem>
                  ))}
                </Select>
              </React.Fragment>
            )}
          </FormControl>
        </GridItem>
        <GridItem>
          {selectedStoreId !== "" &&
            selectedTimeslot !== "" &&
            !fullyStocked && (
              <h6 style={{ color: "red" }}>
                Remove items that are out of stock, or choose another store
              </h6>
            )}
          <Button
            color="success"
            style={{ marginBottom: "20px" }}
            onClick={makeReservation}
            disabled={
              selectedStoreId === "" || selectedTimeslot === "" || !fullyStocked
            }
          >
            Make Reservation
          </Button>
        </GridItem>
      </GridContainer>
    </React.Fragment>
  );
}

export default ReservationBooking;
