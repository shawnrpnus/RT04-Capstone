import React, { useEffect, useState } from "react";
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
import { resendVerifyEmail, emailSending } from "redux/actions/customerActions";
import classNames from "classnames";

function VerifyEmailFailure(props) {
  const { classes } = props;
  console.log(classes);
  const [inputState, setInputState] = useState({
    email: ""
  });

  const history = useHistory();
  const dispatch = useDispatch();
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

  const handleSubmit = () => {
    const emailReq = { email: inputState.email };
    dispatch(resendVerifyEmail(emailReq, history));
    dispatch(emailSending());
  };

  return (
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
          It appears your verification code has expired. Enter your email below
          to request a new one.
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
  );
}

export default VerifyEmailFailure;

VerifyEmailFailure.propTypes = {};
