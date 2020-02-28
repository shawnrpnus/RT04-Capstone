import React, { useEffect, useState } from "react";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import GridItem from "components/Layout/components/Grid/GridItem";
import Button from "components/UI/CustomButtons/Button.js";

import Card from "components/UI/Card/Card";
import CardBody from "components/UI/Card/CardBody";
import InfoArea from "components/UI/InfoArea/InfoArea";
import {
  Check,
  Code,
  Email,
  Face,
  Group,
  Timeline,
  Visibility,
  VisibilityOff
} from "@material-ui/icons";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import image from "assets/img/bg7.jpg";
import signupPageStyle from "assets/jss/material-kit-pro-react/views/signupPageStyle.js";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CustomTextField from "components/UI/CustomInput/CustomTextField";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors } from "redux/actions";
import {
  createNewCustomer,
  emailSending,
  emailSent
} from "redux/actions/customerActions";
import CreateCustomerRequest from "models/customer/CreateCustomerRequest";
import IconButton from "@material-ui/core/IconButton";
import LoadingOverlay from "react-loading-overlay";

const useStyles = makeStyles(signupPageStyle);

function RegisterPage(props) {
  //Hooks
  const classes = useStyles();

  //Redux
  const dispatch = useDispatch();
  const errors = useSelector(state => state.errors);
  const isSendingEmail = useSelector(state => state.customer.isSendingEmail);

  //State
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);
  const [inputState, setInputState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

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

  const handleSubmit = () => {
    const { firstName, lastName, email, password } = inputState;
    const req = new CreateCustomerRequest(firstName, lastName, email, password);
    dispatch(emailSending());
    dispatch(createNewCustomer(req, props.history));
  };

  const handleToggle = () => {
    setChecked(!checked);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <LoadingOverlay
      spinner
      active={isSendingEmail}
      text="Sending you an email..."
    >
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
            <GridItem xs={12} sm={10} md={10}>
              <Card className={classes.cardSignup}>
                <h2 className={classes.cardTitle}>Register</h2>
                <CardBody>
                  <GridContainer justify="center">
                    <GridItem xs={12} sm={5} md={5}>
                      <InfoArea
                        className={classes.infoArea}
                        title="Reservations"
                        description="Reserve your clothes online. Try them in store."
                        icon={Timeline}
                        iconColor="rose"
                      />
                      <InfoArea
                        className={classes.infoArea}
                        title="Seamless In-store Shopping Experience"
                        description="Forget cash and baskets. Get our app. All you need for shopping in our stores. "
                        icon={Code}
                        iconColor="primary"
                      />
                      <InfoArea
                        className={classes.infoArea}
                        title="Personalized"
                        description="Enter your size measurements and get tailored products to suit your needs."
                        icon={Group}
                        iconColor="info"
                      />
                    </GridItem>
                    <GridItem xs={12} sm={5} md={5}>
                      <div className={classes.textCenter}>
                        <Button justIcon round color="twitter">
                          <i className={classes.socials + " fab fa-twitter"} />
                        </Button>
                        {` `}
                        <Button justIcon round color="dribbble">
                          <i className={classes.socials + " fab fa-dribbble"} />
                        </Button>
                        {` `}
                        <Button justIcon round color="facebook">
                          <i
                            className={classes.socials + " fab fa-facebook-f"}
                          />
                        </Button>
                        {` `}
                        <h4 className={classes.socialTitle}>or be classical</h4>
                      </div>
                      <form className={classes.form}>
                        <CustomTextField
                          fieldLabel="First Name"
                          fieldName="firstName"
                          inputState={inputState}
                          onChange={onChange}
                          errors={errors}
                          placeholder="Enter your first name..."
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
                          placeholder="Enter your last name..."
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
                          fieldLabel="Email"
                          fieldName="email"
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
                        <CustomTextField
                          fieldLabel="Password"
                          fieldName="password"
                          type={showPassword ? "text" : "password"}
                          inputState={inputState}
                          onChange={onChange}
                          errors={errors}
                          placeholder="Enter your password..."
                          InputProps={{
                            startAdornment: (
                              <InputAdornment
                                position="start"
                                className={classes.inputAdornment}
                              >
                                <Icon className={classes.inputAdornmentIcon}>
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
                                  {showPassword ? (
                                    <Visibility />
                                  ) : (
                                    <VisibilityOff />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />

                        <FormControlLabel
                          classes={{
                            label: classes.label
                          }}
                          control={
                            <Checkbox
                              onClick={handleToggle}
                              checkedIcon={
                                <Check className={classes.checkedIcon} />
                              }
                              icon={<Check className={classes.uncheckedIcon} />}
                              classes={{
                                checked: classes.checked,
                                root: classes.checkRoot
                              }}
                              checked={checked}
                            />
                          }
                          label={
                            <span>
                              I agree to the{" "}
                              <a href="#terms">terms and conditions</a>.
                            </span>
                          }
                        />
                        <div className={classes.textCenter}>
                          <Button
                            disabled={!checked}
                            onClick={handleSubmit}
                            round
                            color="primary"
                          >
                            Get started
                          </Button>
                        </div>
                      </form>
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    </LoadingOverlay>
  );
}

export default RegisterPage;
