import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import GridContainer from "components/Layout/components/Grid/GridContainer";
import GridItem from "components/Layout/components/Grid/GridItem";
import instagramStyle from "assets/jss/material-kit-pro-react/views/sectionsSections/teamsStyle";
import Instagram from "components/Lookbook/Instagram";
import Parallax from "components/UI/Parallax/Parallax";

const useStyles = makeStyles(instagramStyle);
const _ = require("lodash");

const Lookbook = () => {
  const classes = useStyles();

  return (
    <>
      <Parallax
        image={require("assets/img/examples/bg2.jpg")}
        filter="dark"
        small
      >
        <div style={{ width: "100%", zIndex: 100000 }}>
          <GridContainer>
            <GridItem md={12} sm={12} style={{ textAlign: "center" }}>
              <h2 className={classes.title} style={{ color: "white" }}>
                Lookbook
              </h2>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <Instagram />
    </>
  );
};

export default Lookbook;
