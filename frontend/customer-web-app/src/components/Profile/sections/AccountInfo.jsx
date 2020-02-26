import React, { useEffect, useRef, useState } from "react";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import CustomTextField from "components/UI/CustomInput/CustomTextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Email, Face, Visibility, VisibilityOff } from "@material-ui/icons";
import { clearErrors } from "redux/actions";
import { useDispatch, useSelector } from "react-redux";
import signupPageStyle from "assets/jss/material-kit-pro-react/views/signupPageStyle";
import { makeStyles } from "@material-ui/core/styles";
import Button from "components/UI/CustomButtons/Button";
import UpdateCustomerRequest from "models/customer/UpdateCustomerRequest";
import {
  emailSending,
  sendUpdateEmailLink,
  updateCustomerName
} from "redux/actions/customerActions";
import Snackbar from "@material-ui/core/Snackbar";
import { useSnackbar } from "notistack";
import GridItem from "components/Layout/components/Grid/GridItem";
import Tooltip from "@material-ui/core/Tooltip";
import SendUpdateEmailLinkRequest from "models/customer/SendUpdateEmailLinkRequest";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LoadingOverlay from "react-loading-overlay";
import { DialogContent } from "@material-ui/core";

const useStyles = makeStyles(signupPageStyle);
const _ = require("lodash");

function AccountInfo(props) {
  const { customer } = props;
  //Hooks
  const emailRef = useRef();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  //Selectors
  const isSendingEmail = useSelector(state => state.customer.isSendingEmail);
  const errors = useSelector(state => state.errors);

  //State
  const [inputState, setInputState] = useState({
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    password: "",
    newEmail: "" //to keep for temporary use for showing in dialog
  });
  const [changingEmail, setChangingEmail] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  //Functions
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

  const handleUpdateEmail = () => {
    if (inputState.email !== customer.email) {
      const req = new SendUpdateEmailLinkRequest(
        customer.customerId,
        inputState.email
      );
      setInputState(prevInputState => ({
        ...prevInputState,
        email: customer.email,
        newEmail: prevInputState.email
      }));
      dispatch(sendUpdateEmailLink(req, setDialogOpen));
      dispatch(emailSending());
    } else {
      enqueueSnackbar("Email is the same", {
        variant: "error",
        autoHideDuration: 1200
      });
    }
    setChangingEmail(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setInputState(inputState => ({ ...inputState, email: customer.email }));
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
                {changingEmail ? (
                  <React.Fragment>
                    <Tooltip
                      title="Note: Verification email will be sent to this new email"
                      aria-label="add"
                    >
                      <Button onClick={handleUpdateEmail} round color="primary">
                        Submit
                      </Button>
                    </Tooltip>
                    <Button onClick={() => setChangingEmail(false)} round>
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
            </form>
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
