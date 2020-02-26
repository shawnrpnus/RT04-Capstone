import React, { useEffect } from "react";
import { updateEmail, verify } from "redux/actions/customerActions";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, useRouteMatch } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import VerifyEmailConfirmation from "components/EmailVerification/VerifyEmailConfirmation";
import VerifyEmailFailure from "components/EmailVerification/VerifyEmailFailure";
import dg2 from "assets/img/dg2.jpg";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import { makeStyles } from "@material-ui/core/styles";
import headersStyle from "assets/jss/material-kit-pro-react/views/sectionsSections/headersStyle";

const useStyles = makeStyles(headersStyle);

const _ = require("lodash");

function VerifyEmailChecker(props) {
  const classes = useStyles();
  const { isUpdateEmail } = props;

  const verificationErrors = useSelector(
    state => state.customer.verificationStatus
  );

  const isSendingEmail = useSelector(state => state.customer.isSendingEmail);
  const errors = useSelector(state => state.errors);

  const match = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    const verificationCode = match.params.verificationCode;
    if (isUpdateEmail) {
      dispatch(updateEmail(verificationCode, history));
    } else {
      dispatch(verify(verificationCode, history));
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  const loadingText =
    isSendingEmail && _.isEmpty(errors)
      ? "Sending you an email..."
      : verificationErrors === null
      ? "Verifying..."
      : "";

  return (
    <LoadingOverlay
      spinner
      active={
        (isSendingEmail && _.isEmpty(errors)) || verificationErrors === null
      }
      text={loadingText}
    >
      <div
        className={classes.pageHeader}
        style={{ backgroundImage: `url("${dg2}")` }}
      >
        <div className={classes.container}>
          <GridContainer>
            {verificationErrors === "SUCCESS" ? (
              isUpdateEmail ? (
                <Redirect
                  to={{
                    pathname: "/account/login",
                    state: { isUpdateEmail: true }
                  }}
                />
              ) : (
                <VerifyEmailConfirmation classes={classes} />
              )
            ) : verificationErrors === "FAILURE" ? (
              isUpdateEmail ? (
                <Redirect
                  to
                  to={{
                    pathname: "/account/login",
                    state: { isUpdateEmail: true, linkExpired: true }
                  }}
                />
              ) : (
                <VerifyEmailFailure classes={classes} />
              )
            ) : null}
          </GridContainer>
        </div>
      </div>
    </LoadingOverlay>
  );
}

export default VerifyEmailChecker;
