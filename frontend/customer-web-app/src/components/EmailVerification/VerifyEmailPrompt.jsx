import React, { useEffect } from "react";
import classNames from "classnames";
import GridItem from "components/Layout/components/Grid/GridItem";
import dg2 from "assets/img/dg2.jpg";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import { makeStyles } from "@material-ui/core/styles";
import headersStyle from "assets/jss/material-kit-pro-react/views/sectionsSections/headersStyle";

const useStyles = makeStyles(headersStyle);

const VerifyEmailPrompt = props => {
  const classes = useStyles();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, []);

  return (
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
            <h1 className={classes.title}>Just one more step</h1>
            <h4>
              Click the verification link sent to your email and you're all
              done!
            </h4>
            <br />
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
};

export default VerifyEmailPrompt;
