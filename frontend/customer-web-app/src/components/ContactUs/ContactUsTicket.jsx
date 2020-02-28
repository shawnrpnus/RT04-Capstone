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
  Message
} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import classNames from "classnames";
import InputAdornment from "@material-ui/core/InputAdornment";
import CustomTextField from "../UI/CustomInput/CustomTextField";
import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors } from "../../redux/actions";
import { retrieveAllContactUsCategoryEnum } from "../../redux/actions/contactUsAction";
import CustomDropdown from "../UI/CustomDropdown/CustomDropdown";

const useStyles = makeStyles(contactUsStyle);
const _ = require("lodash");

function ContactUsTicket(props) {
  //Hooks
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  //Redux
  const dispatch = useDispatch();
  useEffect(() => dispatch(retrieveAllContactUsCategoryEnum()), []);

  const errors = useSelector(state => state.errors);
  const enums = useSelector(state => state.contactUs.allContactUsCategoryEnum);

  //State
  const [inputState, setInputState] = useState({
    allContactUsCategoryEnum: []
  });

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

  const onClick = e => {
    console.log(e);
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });

  return (
    <React.Fragment>
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
                        )
                      }}
                    />
                    <CustomDropdown
                      dropdownList={enums}
                      dropdownHeader="ENQUIRY TYPE"
                      onClick={onClick}
                    />
                    <CustomTextField
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
                          ></InputAdornment>
                        ),
                        multiline: true,
                        rows: 6
                      }}
                    />
                    <div className={classes.textCenter}>
                      <Button color="primary" round>
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
                        Bld Mihail Kogalniceanu, nr. 8, <br /> 7652 Bucharest,{" "}
                        <br /> Romania
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
                        Michael Jordan <br /> +40 762 321 762 <br /> Mon - Fri,
                        8:00-22:00
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
                        Creative Tim Ltd. <br /> VAT · EN2341241 <br /> IBAN ·
                        EN8732ENGB2300099123 <br /> Bank · Great Britain Bank
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
