import React, { useEffect, useState } from "react";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import GridItem from "components/Layout/components/Grid/GridItem";
import { makeStyles } from "@material-ui/core/styles";
import wishlistStyle from "assets/jss/material-kit-pro-react/views/wishlistStyle";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductVariantStoreStockStatus,
  retrieveStoresWithStockStatus
} from "redux/actions/reservationActions";
import Select from "@material-ui/core/Select";
import store from "App/store";
import MenuItem from "@material-ui/core/MenuItem";
import StoreCard from "components/Reservation/StoreCard";
import styles from "assets/jss/material-kit-pro-react/customSelectStyle.js";
import customSelectStyle from "assets/jss/material-kit-pro-react/customSelectStyle";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { Button } from "components/UI/CustomButtons/Button";
import { DeleteSharp } from "@material-ui/icons";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { Button as MuiButton } from "@material-ui/core";

const useStyles = makeStyles(wishlistStyle);
const useSelectStyles = makeStyles(customSelectStyle);

function ReservationBooking(props) {
  const classes = useStyles();
  const selectClasses = useSelectStyles();
  const dispatch = useDispatch();
  const customer = useSelector(state => state.customer.loggedInCustomer);
  const storesWithStockStatus = useSelector(
    state => state.reservation.storesWithStockStatus
  );
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [mode, setMode] = useState("");

  const onSelectStore = e => {
    setSelectedStoreId(e.target.value);
    dispatch(
      getProductVariantStoreStockStatus(customer.customerId, e.target.value)
    );
  };

  useEffect(() => {
    if (customer.customerId) {
      dispatch(retrieveStoresWithStockStatus(customer.customerId));
    }
  }, []);

  return (
    <React.Fragment>
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
          <FormControl fullWidth className={selectClasses.selectFormControl}>
            <InputLabel>Select a store</InputLabel>
            <Select onChange={onSelectStore} value={selectedStoreId}>
              {storesWithStockStatus &&
                storesWithStockStatus.map(storeWithStock => (
                  <MenuItem
                    value={storeWithStock.store.storeId}
                    style={{ padding: "0" }}
                  >
                    <StoreCard storeWithStock={storeWithStock} />
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </GridItem>
      </GridContainer>
    </React.Fragment>
  );
}

export default ReservationBooking;
