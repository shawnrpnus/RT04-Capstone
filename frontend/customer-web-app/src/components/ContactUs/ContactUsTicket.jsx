import contactUsStyle from "../../assets/jss/material-kit-pro-react/views/contactUsStyle";
import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import { useEffect } from "react";
import GridContainer from "../Layout/components/Grid/GridContainer";
import GridItem from "../Layout/components/Grid/GridItem";
import CustomInput from "../UI/CustomInput/CustomInput";
import InfoArea from "../UI/InfoArea/InfoArea";
import {
  BusinessCenter,
  Face,
  Phone,
  PinDrop,
  Email,
  Message,
} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import classNames from "classnames";
import InputAdornment from "@material-ui/core/InputAdornment";
import CustomTextField from "../UI/CustomInput/CustomTextField";
import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors } from "../../redux/actions";
import {
  createNewContactUs,
  retrieveAllContactUsCategoryEnum,
} from "../../redux/actions/contactUsAction";
import CreateContactUsRequest from "../../models/contactus/CreateContactUsRequest";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import customSelectStyle from "../../assets/jss/material-kit-pro-react/customSelectStyle";
import Parallax from "components/UI/Parallax/Parallax.js";
import { useSnackbar } from "notistack";

const useStyles = makeStyles(contactUsStyle);
const useClassy = makeStyles(customSelectStyle);
const _ = require("lodash");

function ContactUsTicket(props) {
  //Hooks
  const classes = useStyles();
  const classy = useClassy();

  //Redux
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const errors = useSelector((state) => state.errors);
  const enums = useSelector(
    (state) => state.contactUs.allContactUsCategoryEnum
  );

  //State
  const [inputState, setInputState] = useState({
    allContactUsCategoryEnum: [],
    contactUsCategory: "",
    customerEmail: "",
    content: "",
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);
  useEffect(() => dispatch(retrieveAllContactUsCategoryEnum()), []);

  const {
    contactUsCategory,
    customerEmail,
    content,
    firstName,
    lastName,
  } = inputState;

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

  const handleSubmit = () => {
    const req = new CreateContactUsRequest(
      customerEmail,
      content,
      contactUsCategory,
      firstName,
      lastName
    );
    dispatch(createNewContactUs(req, enqueueSnackbar, setInputState));
  };

  const disable =
    !contactUsCategory || !customerEmail || !content || !firstName || !lastName;

  return (
    <React.Fragment>
      <Parallax image={require("assets/img/bg6.jpg")} small>
        <div style={{ width: "100%" }}>
          <GridContainer>
            <GridItem md={12} sm={12} style={{ textAlign: "center" }}>
              <h2 className={classes.title} style={{ color: "white" }}>
                Contact Us
              </h2>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div>
        <div className={classNames(classes.main, classes.mainRaisedCustom)}>
          <div className={classes.contactContent}>
            <div className={classes.container}>
              <h2 className={classes.title}>Send us a message</h2>
              <GridContainer>
                <GridItem md={6} sm={6}>
                  <p>
                    You can contact us with anything related to our Products. We
                    {"'"}ll get in touch with you as soon as possible.
                    <br />
                    <br />
                  </p>
                  <form>
                    <CustomTextField
                      fieldLabel="Email"
                      fieldName="customerEmail"
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
                      fieldLabel="First Name"
                      fieldName="firstName"
                      fullWidth
                      inputState={inputState}
                      onChange={onChange}
                      errors={errors}
                      placeholder="John"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            className={classes.inputAdornment}
                          >
                            <Face className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <CustomTextField
                      fieldLabel="Last Name"
                      fieldName="lastName"
                      fullWidth
                      inputState={inputState}
                      onChange={onChange}
                      errors={errors}
                      placeholder="Tan"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            className={classes.inputAdornment}
                          >
                            <Face className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <InputLabel
                      htmlFor="simple-select"
                      className={classy.selectLabel}
                    >
                      Enquiry Type
                    </InputLabel>
                    <Select
                      value={contactUsCategory}
                      MenuProps={{
                        className: classes.selectMenu,
                      }}
                      classes={{
                        select: classes.select,
                      }}
                      onChange={onChange}
                      name="contactUsCategory"
                      fullWidth
                      style={{ marginTop: "2%" }}
                    >
                      {enums.map(function(item, index) {
                        return (
                          <MenuItem
                            classes={{
                              root: classy.selectMenuItem,
                              selected: classy.selectMenuItemSelected,
                            }}
                            value={item}
                            key={index}
                          >
                            {item}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    <CustomTextField
                      style={{ marginTop: 20 }}
                      fieldLabel="Content"
                      fieldName="content"
                      fullWidth
                      inputState={inputState}
                      onChange={onChange}
                      errors={errors}
                      placeholder="Any further info you can give us..."
                      InputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            className={classes.inputAdornment}
                          />
                        ),
                        multiline: true,
                        rows: 6,
                      }}
                    />
                    <div className={classes.textCenter}>
                      <Button
                        color="primary"
                        round
                        onClick={handleSubmit}
                        disabled={disable}
                        fullWidth
                      >
                        Contact us
                      </Button>
                    </div>
                  </form>
                </GridItem>
                <GridItem md={4} sm={4} className={classes.mlAuto}>
                  <InfoArea
                    className={classes.info}
                    title="Find us at the office"
                    description={
                      <p>
                        Marina Bay Financial Centre, <br /> 1 Straits View,{" "}
                        <br /> Singapore
                      </p>
                    }
                    icon={PinDrop}
                    iconColor="primary"
                  />
                  <InfoArea
                    className={classes.info}
                    title="Give us a ring"
                    description={
                      <p>
                        Shawn Roshan Pillay <br /> +65 9756 1233 <br /> Mon -
                        Fri, 8:00-22:00
                      </p>
                    }
                    icon={Phone}
                    iconColor="primary"
                  />
                  <InfoArea
                    className={classes.info}
                    title="Legal Information"
                    description={
                      <p>
                        apricot & nut Ltd. <br /> VAT · EN2341241 <br /> IBAN ·
                        EN8732ENGB2300099123 <br /> Bank · United Overseas Bank
                      </p>
                    }
                    icon={BusinessCenter}
                    iconColor="primary"
                  />
                </GridItem>
              </GridContainer>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ContactUsTicket;
