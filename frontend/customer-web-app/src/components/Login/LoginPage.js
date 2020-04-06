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
import { customerLogin } from "redux/actions/customerActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { DialogContent } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import { useLocation, useHistory, Link } from "react-router-dom";
import LinkM from "@material-ui/core/Link";

const useStyles = makeStyles(loginPageStyle);
const _ = require("lodash");

export default function LoginPage(props) {
  //Hooks
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  //Redux
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.errors);

  //State
  const [inputState, setInputState] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState({
    dialogTitle: "",
    dialogContent: "",
  });

  //Effects
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    dispatch(clearErrors());
  }, []);

  useEffect(() => {
    // coming from clicking email update link
    if (_.get(location, "state.isUpdateEmail")) {
      if (_.get(location, "state.linkExpired")) {
        setDialogText({
          dialogTitle: "Error",
          dialogContent:
            "Your link has expired. Please login with your old email and request a new one.",
        });
      } else {
        setDialogText({
          dialogTitle: "Success",
          dialogContent:
            "Your email has been updated. Please login with your new email.",
        });
      }
      setDialogOpen(true);
    }
    // so dialog doesnt show again on refresh
    history.replace({
      pathname: "/account/login",
      state: {},
    });
  }, []);

  //Misc
  const handleSubmit = () => {
    const { email, password } = inputState;
    const req = {
      email: email,
      password: password,
    };
    dispatch(customerLogin(req, props.history));
  };

  const onChange = (e) => {
    e.persist();
    setInputState((inputState) => ({
      ...inputState,
      [e.target.name]: e.target.value,
    }));
    if (Object.keys(errors).length !== 0) {
      dispatch(clearErrors());
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleSubmit();
    }
  };

  return (
    <div
      className={classes.pageHeader}
      style={{
        backgroundImage: "url(" + image + ")",
        backgroundSize: "cover",
        backgroundPosition: "top center",
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
                  <h4 className={classes.cardTitle}>Login</h4>
                  <div className={classes.socialLine}>
                    <Button
                      justIcon
                      color="transparent"
                      className={classes.iconButtons}
                      onClick={(e) => e.preventDefault()}
                    >
                      <i className="fab fa-twitter" />
                    </Button>
                    <Button
                      justIcon
                      color="transparent"
                      className={classes.iconButtons}
                      onClick={(e) => e.preventDefault()}
                    >
                      <i className="fab fa-facebook" />
                    </Button>
                    <Button
                      justIcon
                      color="transparent"
                      className={classes.iconButtons}
                      onClick={(e) => e.preventDefault()}
                    >
                      <i className="fab fa-google-plus-g" />
                    </Button>
                  </div>
                </CardHeader>
                <p className={classes.description + " " + classes.textCenter}>
                  Or Be Classical
                </p>
                <CardBody signup>
                  <CustomTextField
                    fieldLabel="Email"
                    fieldName="email"
                    fullWidth
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
                          <Email className={classes.inputIconsColor} />
                        </InputAdornment>
                      ),
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
                      ),
                    }}
                    onKeyDown={(e) => handleKeyDown(e)}
                  />

                  <LinkM
                    component={Link}
                    to="/account/forgotPassword"
                    color="inherit"
                  >
                    Forgot your password?
                  </LinkM>
                </CardBody>
                <div className={classes.textCenter}>
                  <Button
                    onClick={handleSubmit}
                    simple
                    color="primary"
                    size="lg"
                  >
                    Log in
                  </Button>
                </div>
              </form>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
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
