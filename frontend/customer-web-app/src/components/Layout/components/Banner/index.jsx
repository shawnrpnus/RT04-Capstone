import React, { useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import headersStyle from "assets/jss/material-kit-pro-react/views/sectionsSections/headersStyle.js";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import dg2 from "assets/img/dg2.jpg";
import LandingPage from "components/Layout/components/Banner/components/LandingPage";
import { useSelector } from "react-redux";

import Recommendations from "components/Layout/components/Banner/components/Recommendations";
import Carousel from "components/UI/Carousel/Carousel";

const useStyles = makeStyles(headersStyle);
//make styles takes the style objects, converts them to css
//useStyles returns an object of keyName(as defined in jss style): css classname
const _ = require("lodash");

export default function Banner(props) {
  const classes = useStyles();
  const customer = useSelector(state => state.customer.loggedInCustomer);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  return (
    <React.Fragment>
      <div
        className={classes.pageHeader}
        style={{ backgroundImage: `url("${dg2}")` }}
      >
        <div className={classes.container}>
          <GridContainer>
            <LandingPage classes={classes} />
          </GridContainer>
        </div>
      </div>
      {_.get(customer, "style", false) && (
        <Recommendations classes={classes} customer={customer} />
      )}
      <Carousel />
    </React.Fragment>
  );
}
