import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import Button from "components/UI/CustomButtons/Button.js";
import headersStyle from "assets/jss/material-kit-pro-react/views/sectionsSections/headersStyle.js";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import GridItem from "components/Layout/components/Grid/GridItem";
import dg2 from "assets/img/dg2.jpg";
import LandingPage from "components/Layout/components/Banner/components/LandingPage";
import VerifyEmailPrompt from "components/Layout/components/Banner/components/VerifyEmailPrompt";
import VerifyEmailConfirmation from "components/Layout/components/Banner/components/VerifyEmailConfirmation";

const useStyles = makeStyles(headersStyle);

export default function Banner(props) {
  const classes = useStyles();
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });
  const { landingPage, verifyEmail, verifyEmailConfirmation } = props;
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
              {landingPage && <LandingPage />}
              {verifyEmail && <VerifyEmailPrompt classes={classes} />}
              {verifyEmailConfirmation && (
                <VerifyEmailConfirmation classes={classes} />
              )}
            </GridItem>
          </GridContainer>
        </div>
      </div>
    </div>
  );
}
