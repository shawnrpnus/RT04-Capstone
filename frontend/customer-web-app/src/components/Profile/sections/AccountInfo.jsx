import React, { useEffect, useRef, useState } from "react";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import CustomTextField from "components/UI/CustomInput/CustomTextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import {
  Email,
  Face,
  Lock,
  Visibility,
  VisibilityOff
} from "@material-ui/icons";
import { clearErrors } from "redux/actions";
import { useDispatch, useSelector } from "react-redux";
import signupPageStyle from "assets/jss/material-kit-pro-react/views/signupPageStyle";
import { makeStyles } from "@material-ui/core/styles";
import Button from "components/UI/CustomButtons/Button";
import UpdateCustomerRequest from "models/customer/UpdateCustomerRequest";
import {
  changePassword,
  emailSending,
  emailSent,
  sendUpdateEmailLink,
  updateCustomerName
} from "redux/actions/customerActions";
import { useSnackbar } from "notistack";
import GridItem from "components/Layout/components/Grid/GridItem";
import Tooltip from "@material-ui/core/Tooltip";
import SendUpdateEmailLinkRequest from "models/customer/SendUpdateEmailLinkRequest";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LoadingOverlay from "react-loading-overlay";
import { DialogContent } from "@material-ui/core";
import ChangePasswordRequest from "models/customer/ChangePasswordRequest";
import IconButton from "@material-ui/core/IconButton";
import AddressCard from "./AddressCard";
import AddAddress from "./AddAddress";
import AddCreditCard from "./AddCreditCard";
import CreditCardCard from "./CreditCardCard";

const useStyles = makeStyles(signupPageStyle);
const _ = require("lodash");

function AccountInfo(props) {
  //Hooks
  const emailRef = useRef();
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  //Redux
  const dispatch = useDispatch();
  const isSendingEmail = useSelector(state => state.customer.isSendingEmail);
  const errors = useSelector(state => state.errors);
  const customer = useSelector(state => state.customer.loggedInCustomer);

  //State
  const [inputState, setInputState] = useState({
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    oldPassword: "",
    newPassword: "",
    newEmail: "" //to keep for temporary use for showing in dialog,
  });
  const [changingEmail, setChangingEmail] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [addNewAddress, setAddNewAddress] = useState(false);
  const [currAddress, setCurrAddress] = useState("");

  //Effects
  //Cleanup on unmount
  useEffect(() => {
    return () => dispatch(emailSent());
  }, []);

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

  const handleUpdateName = () => {
    const req = new UpdateCustomerRequest(
      customer.customerId,
      inputState.firstName,
      inputState.lastName
    );
    dispatch(updateCustomerName(req, enqueueSnackbar));
  };

  const resetInputState = () => {
    setInputState(prevInputState => ({
      ...prevInputState,
      email: customer.email,
      newEmail: prevInputState.email
    }));
  };

  const handleUpdateEmail = () => {
    if (inputState.email !== customer.email) {
      const req = new SendUpdateEmailLinkRequest(
        customer.customerId,
        inputState.email
      );
      dispatch(
        sendUpdateEmailLink(
          req,
          setDialogOpen,
          resetInputState,
          setChangingEmail,
          enqueueSnackbar
        )
      );
      setTimeout(() => dispatch(emailSending()), 500);
    } else {
      enqueueSnackbar("Email is the same", {
        variant: "error",
        autoHideDuration: 1200
      });
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setInputState(inputState => ({ ...inputState, email: customer.email }));
  };

  const handleChangePassword = () => {
    const req = new ChangePasswordRequest(
      customer.customerId,
      inputState.oldPassword,
      inputState.newPassword
    );
    dispatch(changePassword(req, enqueueSnackbar, setChangingPassword));
    setInputState(inputState => ({
      ...inputState,
      oldPassword: "",
      newPassword: ""
    }));
  };

  const handleClickShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };

  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleAddNewAddress = () => {
    setAddNewAddress(!addNewAddress);
    console.log(addNewAddress);
  };

  return (
    <React.Fragment>
      <LoadingOverlay
        spinner
        active={isSendingEmail && _.isEmpty(errors)}
        text="Sending you an email..."
      >
        <GridContainer>
          <GridItem xs={12} sm={12} md={5}>
            <form className={classes.form}>
              <CustomTextField
                fieldLabel="First Name"
                fieldName="firstName"
                inputState={inputState}
                onChange={onChange}
                errors={errors}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      className={classes.inputAdornment}
                    >
                      <Face className={classes.inputAdornmentIcon} />
                    </InputAdornment>
                  )
                }}
              />
              <CustomTextField
                fieldLabel="Last Name"
                fieldName="lastName"
                inputState={inputState}
                onChange={onChange}
                errors={errors}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      className={classes.inputAdornment}
                    >
                      <Face className={classes.inputAdornmentIcon} />
                    </InputAdornment>
                  )
                }}
              />
              <div className={classes.textCenter}>
                <Button onClick={handleUpdateName} round color="primary">
                  Save changes
                </Button>
              </div>
              <CustomTextField
                fieldLabel="Email"
                fieldName="email"
                inputRef={emailRef}
                id={"emailfield"}
                disabled={!changingEmail}
                inputState={inputState}
                onChange={onChange}
                errors={errors}
                placeholder="Enter a valid email..."
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
              />
              <div className={classes.textCenter}>
                {changingEmail || _.get(errors, "email") ? (
                  <React.Fragment>
                    <Tooltip
                      title="Note: Verification email will be sent to this new email"
                      aria-label="add"
                    >
                      <Button onClick={handleUpdateEmail} round color="primary">
                        Submit
                      </Button>
                    </Tooltip>
                    <Button
                      onClick={() => {
                        setChangingEmail(false);
                        resetInputState();
                        dispatch(clearErrors());
                      }}
                      round
                    >
                      Cancel
                    </Button>
                  </React.Fragment>
                ) : (
                  <Button
                    onClick={() => {
                      setChangingEmail(true);
                      setTimeout(() => {
                        emailRef.current.focus();
                      }, 100);
                    }}
                    round
                    color="primary"
                  >
                    Change Email
                  </Button>
                )}
              </div>
              {changingPassword && (
                <React.Fragment>
                  <CustomTextField
                    fieldLabel="Old Password"
                    fieldName="oldPassword"
                    type={showOldPassword ? "text" : "password"}
                    autoFocus
                    inputState={inputState}
                    onChange={onChange}
                    errors={errors}
                    placeholder="Enter your old password..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          className={classes.inputAdornment}
                        >
                          <Lock className={classes.inputAdornmentIcon} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowOldPassword}
                          >
                            {showOldPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  <CustomTextField
                    fieldLabel="New Password"
                    fieldName="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    inputState={inputState}
                    onChange={onChange}
                    errors={errors}
                    placeholder="Enter a new password..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          className={classes.inputAdornment}
                        >
                          <Lock className={classes.inputAdornmentIcon} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowNewPassword}
                          >
                            {showNewPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </React.Fragment>
              )}
              <div className={classes.textCenter}>
                {changingPassword ? (
                  <React.Fragment>
                    <Tooltip
                      title="Note: Verification email will be sent to this new email"
                      aria-label="add"
                    >
                      <Button
                        onClick={handleChangePassword}
                        round
                        color="primary"
                      >
                        Submit
                      </Button>
                    </Tooltip>
                    <Button
                      onClick={() => {
                        setChangingPassword(false);
                        resetInputState();
                        dispatch(clearErrors());
                      }}
                      round
                    >
                      Cancel
                    </Button>
                  </React.Fragment>
                ) : (
                  <Button
                    onClick={() => {
                      setChangingPassword(true);
                    }}
                    round
                    color="primary"
                  >
                    Change Password
                  </Button>
                )}
              </div>
            </form>
            <AddCreditCard />
            <CreditCardCard />
          </GridItem>
          <GridItem xs={12} sm={12} md={2}></GridItem>
          {addNewAddress === true ? (
            <GridItem xs={12} sm={12} md={5}>
              <AddAddress
                addNewAddress={[addNewAddress, setAddNewAddress]}
                currAddress={[currAddress, setCurrAddress]}
              />
            </GridItem>
          ) : currAddress !== "" ? (
            <GridItem xs={12} sm={12} md={5}>
              <AddAddress
                addNewAddress={[addNewAddress, setAddNewAddress]}
                currAddress={[currAddress, setCurrAddress]}
              />
            </GridItem>
          ) : addNewAddress === false ? (
            <GridItem xs={12} sm={12} md={5}>
              <Button onClick={handleAddNewAddress} round color="primary">
                Add New Address
              </Button>
              <AddressCard
                addNewAddress={[addNewAddress, setAddNewAddress]}
                currAddress={[currAddress, setCurrAddress]}
              />
            </GridItem>
          ) : (
            ""
          )}
        </GridContainer>
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle id="simple-dialog-title">Verify your email</DialogTitle>
          <DialogContent>
            Click the link in the email sent to <b>{inputState.newEmail}</b> to
            update your email.
            <br />
          </DialogContent>
        </Dialog>
      </LoadingOverlay>
    </React.Fragment>
  );
}

export default AccountInfo;
