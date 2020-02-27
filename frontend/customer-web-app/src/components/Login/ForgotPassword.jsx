import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendResetPasswordLink, verify } from "redux/actions/customerActions";
import { useRouteMatch, useHistory } from "react-router-dom";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import GridItem from "components/Layout/components/Grid/GridItem";
import Button from "components/UI/CustomButtons/Button.js";
import Card from "components/UI/Card/Card";
import CardBody from "components/UI/Card/CardBody";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Email } from "@material-ui/icons";
import CustomTextField from "components/UI/CustomInput/CustomTextField";
import { clearErrors } from "redux/actions";
import {
  resendVerifyEmail,
  emailSending,
  emailSent
} from "redux/actions/customerActions";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import headersStyle from "assets/jss/material-kit-pro-react/views/sectionsSections/headersStyle";
import dg2 from "assets/img/dg2.jpg";
import DialogTitle from "@material-ui/core/DialogTitle";
import { DialogContent } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import LoadingOverlay from "react-loading-overlay";

const useStyles = makeStyles(headersStyle);
const _ = require("lodash");

function ForgotPassword(props) {
  //Hooks
  const history = useHistory();
  const classes = useStyles();

  //Redux
  const dispatch = useDispatch();
  const errors = useSelector(state => state.errors);
  const isSendingEmail = useSelector(state => state.customer.isSendingEmail);

  //State
  const [inputState, setInputState] = useState({
    email: ""
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  //Effects
  useEffect(() => {
    return () => dispatch(emailSent());
  });

  //Misc
  const onChange = e => {
    e.persist();
    setInputState(inputState => ({
      ...inputState,
      [e.target.name]: e.target.value
    }));
    if (Object.keys(errors).length !== 0) {
      dispatch(clearErrors());
    }
  };

  const handleSubmit = () => {
    const emailReq = { email: inputState.email };
    dispatch(sendResetPasswordLink(emailReq, setDialogOpen));
    dispatch(emailSending());
  };

  return (
    <React.Fragment>
      <LoadingOverlay
        spinner
        active={isSendingEmail && _.isEmpty(errors)}
        text="Sending you an email..."
      >
        <div
          className={classes.pageHeader}
          style={{ backgroundImage: `url("${dg2}")` }}
        >
          <div className={classes.container}>
            <GridContainer>
              <GridItem
                xs={12}
                sm={8}
                md={8}
                className={classNames(
                  classes.mlAuto,
                  classes.mrAuto,
                  classes.textCenter
                )}
              >
                <h1 className={classes.title}>Forgot your password?</h1>
                <h4>Enter your email below to reset your password.</h4>
              </GridItem>
              <GridItem
                xs={11}
                sm={6}
                md={6}
                className={classNames(classes.mlAuto, classes.mrAuto)}
              >
                <Card raised className={classes.card}>
                  <CardBody formHorizontal>
                    <GridContainer className={classes.alignCenter}>
                      <GridItem xs={12} sm={12} md={9}>
                        <CustomTextField
                          fieldLabel="Email"
                          fieldName="email"
                          fullWidth
                          autoFocus
                          inputState={inputState}
                          onChange={onChange}
                          errors={errors}
                          placeholder="Enter your email..."
                          InputProps={{
                            startAdornment: (
                              <InputAdornment
                                position="start"
                                className={classes.inputAdornment}
                              >
                                <Email className={classes.inputAdornmentIcon} />
                              </InputAdornment>
                            )
                          }}
                          formControlClassName={classes.marginBottomFive}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={3}>
                        <Button
                          onClick={handleSubmit}
                          block
                          color="primary"
                          className={classes.button}
                        >
                          Send Email
                        </Button>
                      </GridItem>
                    </GridContainer>
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
        </div>
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle id="simple-dialog-title">Email sent</DialogTitle>
          <DialogContent>
            Please check your email (<b>{inputState.email}</b>) for a link to
            reset your password.
            <br />
          </DialogContent>
        </Dialog>
      </LoadingOverlay>
    </React.Fragment>
  );
}

export default ForgotPassword;

ForgotPassword.propTypes = {};
