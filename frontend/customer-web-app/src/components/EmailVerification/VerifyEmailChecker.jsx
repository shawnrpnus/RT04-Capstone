import React, { useEffect } from "react";
import { verify } from "redux/actions/customerActions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import VerifyEmailConfirmation from "components/EmailVerification/VerifyEmailConfirmation";
import VerifyEmailFailure from "components/EmailVerification/VerifyEmailFailure";
import dg2 from "assets/img/dg2.jpg";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import { makeStyles } from "@material-ui/core/styles";
import headersStyle from "assets/jss/material-kit-pro-react/views/sectionsSections/headersStyle";

const useStyles = makeStyles(headersStyle);

function VerifyEmailChecker(props) {
  const classes = useStyles();

  const verificationErrors = useSelector(
    state => state.customer.verificationStatus
  );

  const isSendingEmail = useSelector(state => state.customer.isSendingEmail);

  const match = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    const verificationCode = match.params.verificationCode;
    dispatch(verify(verificationCode, history));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  return (
    <LoadingOverlay
      spinner
      active={isSendingEmail || verificationErrors === null}
      text="Sending you an email..."
    >
      <div
        className={classes.pageHeader}
        style={{ backgroundImage: `url("${dg2}")` }}
      >
        <div className={classes.container}>
          <GridContainer>
            {verificationErrors === "SUCCESS" ? (
              <VerifyEmailConfirmation classes={classes} />
            ) : verificationErrors === "FAILURE" ? (
              <VerifyEmailFailure classes={classes} />
            ) : null}
          </GridContainer>
        </div>
      </div>
    </LoadingOverlay>
  );
}

export default VerifyEmailChecker;
