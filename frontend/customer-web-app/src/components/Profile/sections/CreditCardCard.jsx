import makeStyles from "@material-ui/core/styles/makeStyles";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { clearErrors } from "../../../redux/actions";
import Button from "../../UI/CustomButtons/Button";
import customCheckboxRadioSwitch from "../../../assets/jss/material-kit-pro-react/customCheckboxRadioSwitchStyle";
import { useSnackbar } from "notistack";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";
import { deleteCard } from "./../../../redux/actions/customerActions";

const useStyles = makeStyles(customCheckboxRadioSwitch);

// do this to edit props (pass in props as a tuple)
export default function CreditCardCard() {
  //Hooks
  const classes = useStyles();
  const history = useHistory();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  //Redux
  const dispatch = useDispatch();
  const errors = useSelector(state => state.errors);
  const { creditCards, customerId } = useSelector(
    state => state.customer.loggedInCustomer
  );
  console.log(creditCards);

  const handleDeleteCard = creditCardId => {
    console.log(customerId);
    console.log(creditCardId);
    dispatch(deleteCard({ customerId, creditCardId }));
  };

  return (
    <div>
      {/* <h4 style={{ marginBottom: 0 }}>Add New Address</h4> */}
      {/* <small>
        Please enter an address you would like to save and deliver your items
        to.
      </small> */}
      {creditCards.map(
        ({ creditCardId, last4, expiryMonth, expiryYear, issuer }) => {
          if (expiryMonth < 10) {
            expiryMonth = `0${expiryMonth}`;
          }
          console.log(last4);
          return (
            <Grid
              container
              alignItems="center"
              style={{ textAlign: "center", margin: "5% 0" }}
            >
              <Grid item xs={10} className={classes.creditCardContainer}>
                <Cards
                  cvc={" "}
                  expiry={`${expiryMonth}/${expiryYear}`}
                  // focus={this.state.focus}
                  name=" "
                  number={`••••••••••••${last4}`}
                  preview={true}
                  issuer={issuer}
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton
                  onClick={() => handleDeleteCard(creditCardId)}
                  style={{ marginTop: "-15%" }}
                >
                  <CancelIcon style={{ color: "red" }} />
                </IconButton>
              </Grid>
            </Grid>
          );
        }
      )}
    </div>
  );
}
