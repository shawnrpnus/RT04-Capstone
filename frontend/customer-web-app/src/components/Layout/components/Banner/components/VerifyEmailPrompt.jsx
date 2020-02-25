import React from "react";
import classNames from "classnames";
import GridItem from "components/Layout/components/Grid/GridItem";

const VerifyEmailPrompt = classes => {
  return (
    <GridItem
      xs={12}
      sm={8}
      md={8}
      className={classNames(classes.mlAuto, classes.mrAuto, classes.textCenter)}
    >
      ><h1 className={classes.title}>Just one more step</h1>
      <h4>
        Click the verification link sent to your email and you're all done!
      </h4>
      <br />
    </GridItem>
  );
};

export default VerifyEmailPrompt;
