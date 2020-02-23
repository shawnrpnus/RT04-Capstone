import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import Button from "components/UI/CustomButtons/Button.js";
import headersStyle from "assets/jss/material-kit-pro-react/views/sectionsSections/headersStyle.js";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import GridItem from "components/Layout/components/Grid/GridItem";
import dg2 from "assets/img/dg2.jpg";

const useStyles = makeStyles(headersStyle);

export default function Banner(props) {
  const classes = useStyles();

  return (
    <div>
      <div
        className={classes.pageHeader}
        style={{ backgroundImage: `url("${dg2}")` }}
      >
        <div className={classes.container}>
          <GridContainer>
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
              <h1 className={classes.title}>Come buy our shit</h1>
              <h4>You can reserve fitting rooms and stuff</h4>
              <br />
              <h6>Shop Now:</h6>
              <div>
                <Button color="white" simple size="lg" justIcon>
                  <i className="fab fa-twitter" />
                </Button>
                <Button color="white" simple size="lg" justIcon>
                  <i className="fab fa-facebook-square" />
                </Button>
                <Button color="white" simple size="lg" justIcon>
                  <i className="fab fa-google-plus-g" />
                </Button>
                <Button color="white" simple size="lg" justIcon>
                  <i className="fab fa-instagram" />
                </Button>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    </div>
  );
}
