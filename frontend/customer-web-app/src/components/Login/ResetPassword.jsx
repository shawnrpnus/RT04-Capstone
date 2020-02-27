/*eslint-disable*/
import React, { useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

import Email from "@material-ui/icons/Email";
import GridContainer from "components/Layout/components/Grid/GridContainer.js";
import GridItem from "components/Layout/components/Grid/GridItem.js";
import Button from "components/UI/CustomButtons/Button.js";
import Card from "components/UI/Card/Card.js";
import CardBody from "components/UI/Card/CardBody.js";
import CardHeader from "components/UI/Card/CardHeader.js";

import loginPageStyle from "assets/jss/material-kit-pro-react/views/loginPageStyle.js";

import image from "assets/img/bg7.jpg";
import CustomTextField from "components/UI/CustomInput/CustomTextField";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors } from "redux/actions";
import IconButton from "@material-ui/core/IconButton";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { customerLogin, resetPassword } from "redux/actions/customerActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { DialogContent } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import { useLocation, useHistory, Link, useRouteMatch } from "react-router-dom";
import LinkM from "@material-ui/core/Link";
import { isValidES3Identifier } from "@babel/types";

const useStyles = makeStyles(loginPageStyle);
const _ = require("lodash");

export default function ResetPassword(props) {
  //Hooks
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  if (!match.params.verificationCode) {
    history.push("/404");
  }

  //Redux
  const dispatch = useDispatch();
  const errors = useSelector(state => state.errors);
  const verificationStatus = useSelector(
    state => state.customer.verificationStatus
  );

  //State
  const [inputState, setInputState] = useState({
    newPassword: "",
    confirmNewPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState({
    dialogTitle: "",
    dialogContent: ""
  });

  //Effects
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  //Misc
  const handleSubmit = () => {
    const verificationCode = match.params.verificationCode;
    const req = {
      verificationCode: verificationCode,
      newPassword: inputState.newPassword,
      confirmNewPassword: inputState.confirmNewPassword
    };
    //on success, set dialog open, show message, redirect to login
    //failure, link expired/invalid -> redirect to forget password,
    dispatch(resetPassword(req, setDialogOpen, setDialogText));
  };

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

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyDown = event => {
    if (event.keyCode === 13) {
      handleSubmit();
    }
  };

  const handleDialogClose = () => {
    if (verificationStatus === "SUCCESS") {
      history.push("/account/login");
    } else if (verificationStatus === "FAILURE") {
      history.push("/account/forgotPassword");
    }
  };

  return (
    <div
      className={classes.pageHeader}
      style={{
        backgroundImage: "url(" + image + ")",
        backgroundSize: "cover",
        backgroundPosition: "top center"
      }}
    >
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={4}>
            <Card>
              <form className={classes.form}>
                <CardHeader
                  color="primary"
                  signup
                  className={classes.cardHeader}
                >
                  <h4 className={classes.cardTitle}>Reset password</h4>
                </CardHeader>
                <CardBody signup>
                  <CustomTextField
                    fieldLabel="New Password"
                    fieldName="newPassword"
                    type={showPassword ? "text" : "password"}
                    inputState={inputState}
                    onChange={onChange}
                    errors={errors}
                    placeholder="Enter your new password..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          className={classes.inputAdornment}
                        >
                          <Icon className={classes.inputIconsColor}>
                            lock_outline
                          </Icon>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    onKeyDown={e => handleKeyDown(e)}
                  />
                  <CustomTextField
                    fieldLabel="Confirm New Password"
                    fieldName="confirmNewPassword"
                    type={showPassword ? "text" : "password"}
                    inputState={inputState}
                    onChange={onChange}
                    errors={errors}
                    placeholder="Confirm your new password..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          className={classes.inputAdornment}
                        >
                          <Icon className={classes.inputIconsColor}>
                            lock_outline
                          </Icon>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    onKeyDown={e => handleKeyDown(e)}
                  />
                </CardBody>
                <div className={classes.textCenter}>
                  <Button
                    onClick={handleSubmit}
                    simple
                    color="primary"
                    size="lg"
                  >
                    Reset Password
                  </Button>
                </div>
              </form>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle id="simple-dialog-title">
          {dialogText.dialogTitle}
        </DialogTitle>
        <DialogContent>
          {dialogText.dialogContent}
          <br />
        </DialogContent>
      </Dialog>
    </div>
  );
}
