import React, { useEffect, useState } from "react";
import * as PropTypes from "prop-types";
import { CircularProgress } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { Circle } from "react-google-maps";
import { verify } from "redux/actions/customerActions";
import { useRouteMatch } from "react-router-dom";

function VerifyEmailConfirmation(props) {
  const { classes } = props;
  const match = useRouteMatch();
  const dispatch = useDispatch();
  useEffect(() => {
    const verificationCode = match.params.verificationCode;
    dispatch(verify(verificationCode));
  }, []);
  const errors = useSelector(state => state.errors);
  const loggedInCustomer = useSelector(
    state => state.customer.loggedInCustomer
  );

  return (
    <React.Fragment>
      {loggedInCustomer ? (
        <React.Fragment>
          <h1 className={classes.title}>You're verified!</h1>
          <h4>Start shopping!</h4>
          <br />
        </React.Fragment>
      ) : errors ? (
        <React.Fragment>
          <h1 className={classes.title}>Verification failed!</h1>
          <h4>
            It appears your verification code has expired. Enter your email
            below to request a new one.
          </h4>
          <br />
        </React.Fragment>
      ) : (
        <CircularProgress />
      )}
    </React.Fragment>
  );
}

export default VerifyEmailConfirmation;

VerifyEmailConfirmation.propTypes = {};
