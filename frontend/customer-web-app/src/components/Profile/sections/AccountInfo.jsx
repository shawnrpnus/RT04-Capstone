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
  refreshCustomerEmail,
  refreshCustomerId,
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
import AddressCard from "components/Profile/sections/Address/AddressCard";
import AddAddress from "components/Profile/sections/Address/AddAddress";
import AddCreditCard from "components/Profile/sections/CreditCard/AddCreditCard";
import CreditCardCard from "components/Profile/sections/CreditCard/CreditCardCard";
import ReviewCardForProfilePage from "components/Reviews/ReviewCardForProfilePage";
import Divider from "@material-ui/core/Divider";

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
    confirmNewPassword: "",
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

  useEffect(() => {
    dispatch(refreshCustomerId(customer.customerId));
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
      inputState.newPassword,
      inputState.confirmNewPassword
    );
    dispatch(
      changePassword(req, enqueueSnackbar, setChangingPassword, setInputState)
    );
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
          <GridItem xs={12} sm={12} md={6} style={{ padding: "0 40px" }}>
            <h4>
              <b>My Details</b>
            </h4>
            <form className={classes.form} style={{ marginTop: "15px" }}>
              <GridContainer>
                <GridItem md={12}>
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
                </GridItem>
                <GridItem md={12}>
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
                </GridItem>
                <GridItem md={12}>
                  <div className={classes.textCenter}>
                    <Button
                      onClick={handleUpdateName}
                      color="primary"
                      style={{ float: "right" }}
                    >
                      Save changes
                    </Button>
                  </div>
                </GridItem>
                <GridItem md={12}>
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
                </GridItem>
                <GridItem md={12}>
                  <div className={classes.textCenter}>
                    {changingEmail || _.get(errors, "email") ? (
                      <React.Fragment>
                        <Tooltip
                          title="Note: Verification email will be sent to this new email"
                          aria-label="add"
                        >
                          <Button
                            onClick={handleUpdateEmail}
                            color="success"
                            style={{ float: "right" }}
                          >
                            Submit
                          </Button>
                        </Tooltip>
                        <Button
                          onClick={() => {
                            setChangingEmail(false);
                            resetInputState();
                            dispatch(clearErrors());
                          }}
                          style={{ float: "right" }}
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
                        color="primary"
                        style={{ float: "right" }}
                      >
                        Change Email
                      </Button>
                    )}
                  </div>
                </GridItem>
                <GridItem md={12}>
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
                      <CustomTextField
                        fieldLabel="Confirm New Password"
                        fieldName="confirmNewPassword"
                        type={showNewPassword ? "text" : "password"}
                        inputState={inputState}
                        onChange={onChange}
                        errors={errors}
                        placeholder="Confirm new password..."
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
                </GridItem>
                <GridItem md={12}>
                  <div className={classes.textCenter}>
                    {changingPassword ? (
                      <React.Fragment>
                        <Tooltip
                          title="Note: Verification email will be sent to this new email"
                          aria-label="add"
                        >
                          <Button
                            onClick={handleChangePassword}
                            color="success"
                            style={{ float: "right" }}
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
                          style={{ float: "right" }}
                        >
                          Cancel
                        </Button>
                      </React.Fragment>
                    ) : (
                      <Button
                        onClick={() => {
                          setChangingPassword(true);
                        }}
                        color="primary"
                        style={{ float: "right" }}
                      >
                        Change Password
                      </Button>
                    )}
                  </div>
                </GridItem>
              </GridContainer>
            </form>
          </GridItem>
          <GridItem xs={12} sm={12} md={6} style={{ padding: "0 40px" }}>
            {addNewAddress === true || currAddress !== "" ? (
              <React.Fragment>
                <h4>My Address Book</h4>
                <AddAddress
                  addNewAddress={[addNewAddress, setAddNewAddress]}
                  currAddress={[currAddress, setCurrAddress]}
                />
              </React.Fragment>
            ) : addNewAddress === false ? (
              <React.Fragment>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between"
                  }}
                >
                  <h4>
                    <b>My Address Book</b>
                  </h4>
                  <Button
                    onClick={handleAddNewAddress}
                    color="primary"
                    style={{ float: "right" }}
                  >
                    Add New Address
                  </Button>
                </div>
                <AddressCard
                  addNewAddress={[addNewAddress, setAddNewAddress]}
                  currAddress={[currAddress, setCurrAddress]}
                />
              </React.Fragment>
            ) : (
              ""
            )}
          </GridItem>
          <GridItem xs={12} sm={12} md={6} style={{ padding: "0 40px" }}>
            <h4>
              <b>My Reviews</b>
            </h4>
            <ReviewCardForProfilePage />
          </GridItem>
          <GridItem xs={12} sm={12} md={6} style={{ padding: "0 40px" }}>
            <h4>
              <b>My Credit Cards</b>
            </h4>
            <AddCreditCard setIsLoading={props.setIsLoading} />
            <CreditCardCard setIsLoading={props.setIsLoading} />
          </GridItem>
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
