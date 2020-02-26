import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verify } from "redux/actions/customerActions";
import { useRouteMatch, useHistory } from "react-router-dom";
import GridItem from "components/Layout/components/Grid/GridItem";

import classNames from "classnames";

function VerifyEmailConfirmation(props) {
  const { classes } = props;

  const match = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    const verificationCode = match.params.verificationCode;
    dispatch(verify(verificationCode, history));
  }, []);

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
