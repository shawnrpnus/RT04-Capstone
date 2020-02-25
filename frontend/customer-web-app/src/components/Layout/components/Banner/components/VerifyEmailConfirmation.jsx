import React, { useEffect, useState } from "react";
import * as PropTypes from "prop-types";
import { CircularProgress } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { verify } from "redux/actions/customerActions";
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
import { resendVerifyEmail } from "redux/actions/customerActions";
import classNames from "classnames";

function VerifyEmailConfirmation(props) {
  const { classes } = props;
  console.log(classes);
  const [inputState, setInputState] = useState({
    email: ""
  });
  const [sendingEmail, setSendingEmail] = useState(false);

  const match = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const errors = useSelector(state => state.errors);
  const loggedInCustomer = useSelector(
    state => state.customer.loggedInCustomer
  );

  useEffect(() => {
    const verificationCode = match.params.verificationCode;
    dispatch(verify(verificationCode));
  }, []);

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

  const emailSent = () => {
    setSendingEmail(false);
  };

  const handleSubmit = () => {
    dispatch(resendVerifyEmail(inputState.email, history, emailSent));
    setSendingEmail(true);
  };

  return (
    <React.Fragment>
      {loggedInCustomer && !sendingEmail ? (
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
          <h1 className={classes.title}>You're verified!</h1>
          <h4>Start shopping!</h4>
          <br />
        </GridItem>
      ) : errors ? (
        <React.Fragment>
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
            <h1 className={classes.title}>Verification failed!</h1>
            <h4>
              It appears your verification code has expired. Enter your email
              below to request a new one.
            </h4>
          </GridItem>
          <GridItem
            xs={11}
            sm={6}
            md={6}
            className={classNames(classes.mlAuto, classes.mrAuto)}
          >
            <Card raised className={classes.card}>
              <CardBody formHorizontal>
                <form>
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
                        Resend Email
                      </Button>
                    </GridItem>
                  </GridContainer>
                </form>
              </CardBody>
            </Card>
          </GridItem>
        </React.Fragment>
      ) : (
        <CircularProgress />
      )}
    </React.Fragment>
  );
}

export default VerifyEmailConfirmation;

VerifyEmailConfirmation.propTypes = {};
