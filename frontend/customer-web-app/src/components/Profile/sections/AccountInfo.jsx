import React, { useState } from "react";
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
import { updateCustomerName } from "redux/actions/customerActions";
import Snackbar from "@material-ui/core/Snackbar";
import { useSnackbar } from "notistack";

const useStyles = makeStyles(signupPageStyle);

function AccountInfo(props) {
  const { customer } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [inputState, setInputState] = useState({
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    password: ""
  });
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const errors = useSelector(state => state.errors);

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

  return (
    <GridContainer>
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
          disabled
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
      </form>
    </GridContainer>
  );
}

export default AccountInfo;
