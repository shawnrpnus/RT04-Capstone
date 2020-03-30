import makeStyles from "@material-ui/core/styles/makeStyles";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { clearErrors } from "redux/actions";
import Button from "components/UI/CustomButtons/Button";
import customCheckboxRadioSwitch from "assets/jss/material-kit-pro-react/customCheckboxRadioSwitchStyle";
import { useSnackbar } from "notistack";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import { deleteCard } from "redux/actions/customerActions";

const useStyles = makeStyles(customCheckboxRadioSwitch);

// do this to edit props (pass in props as a tuple)
export default function CreditCardCard({ setIsLoading }) {
  //Hooks
  const classes = useStyles();
  const history = useHistory();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  //Redux
  const dispatch = useDispatch();
  const errors = useSelector(state => state.errors);
  const { creditCards, customerId } = useSelector(
    state => state.customer.loggedInCustomer
  );

  const handleDeleteCard = creditCardId => {
    setIsLoading(true);
    dispatch(deleteCard({ customerId, creditCardId }, setIsLoading));
    setPopoverOpen(false);
  };

  const clearConfirmation = e => {
    setAnchorEl(e.currentTarget);
    setPopoverOpen(true);
  };

  return (
    <div>
      {creditCards.map(
        ({ creditCardId, last4, expiryMonth, expiryYear, issuer }, index) => {
          if (expiryMonth < 10) {
            expiryMonth = `0${expiryMonth}`;
          }
          return (
            <Grid
              container
              alignItems="center"
              style={{ textAlign: "center", margin: "5% 0" }}
              key={index}
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
                  onClick={clearConfirmation}
                  style={{ marginTop: "-15%" }}
                >
                  <CancelIcon style={{ color: "red" }} />
                </IconButton>
              </Grid>
              <Popper
                open={popoverOpen}
                anchorEl={anchorEl}
                style={{ zIndex: "2000" }}
                placement="bottom"
              >
                <ClickAwayListener onClickAway={() => setPopoverOpen(false)}>
                  <Paper style={{ padding: "5px" }}>
                    <h5 style={{ textAlign: "center", marginBottom: "0" }}>
                      Delete?
                    </h5>
                    <Button
                      color="danger"
                      onClick={() => handleDeleteCard(creditCardId)}
                    >
                      Yes
                    </Button>
                    <Button onClick={() => setPopoverOpen(false)}>No</Button>
                  </Paper>
                </ClickAwayListener>
              </Popper>
            </Grid>
          );
        }
      )}
    </div>
  );
}
