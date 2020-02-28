import React from "react";
import GridItem from "components/Layout/components/Grid/GridItem";

import classNames from "classnames";

function VerifyEmailConfirmation(props) {
  const { classes } = props;

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
        <h1 className={classes.title}>You're verified!</h1>
        <h4>Start shopping!</h4>
        <br />
      </GridItem>
    </React.Fragment>
  );
}

export default VerifyEmailConfirmation;

VerifyEmailConfirmation.propTypes = {};
