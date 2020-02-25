import React from "react";

const VerifyEmailPrompt = classes => {
  return (
    <React.Fragment>
      <h1 className={classes.title}>Just one more step</h1>
      <h4>
        Click the verification link sent to your email and you're all done!
      </h4>
      <br />
    </React.Fragment>
  );
};

export default VerifyEmailPrompt;
