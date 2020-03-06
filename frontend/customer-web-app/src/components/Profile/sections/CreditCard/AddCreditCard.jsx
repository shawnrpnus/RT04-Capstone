import makeStyles from "@material-ui/core/styles/makeStyles";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { clearErrors } from "redux/actions";
import Button from "components/UI/CustomButtons/Button";
import customCheckboxRadioSwitch from "assets/jss/material-kit-pro-react/customCheckboxRadioSwitchStyle";
import { useSnackbar } from "notistack";
import CardSetupForm from "components/Profile/sections/CreditCard/CardSetupForm";

const useStyles = makeStyles(customCheckboxRadioSwitch);

// do this to edit props (pass in props as a tuple)
export default function AddCreditCard({ setIsLoading }) {
  //Hooks
  const classes = useStyles();
  const history = useHistory();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  //Redux
  const dispatch = useDispatch();
  const errors = useSelector(state => state.errors);
  const currCustomer = useSelector(state => state.customer.loggedInCustomer);

  return (
    <div>
      <h6>Add New Credit Card</h6>
      {/* <small>
        Please enter an address you would like to save and deliver your items
        to.
      </small> */}
      <CardSetupForm setIsLoading={setIsLoading} />
    </div>
  );
}
