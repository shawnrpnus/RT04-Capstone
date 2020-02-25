import React from "react";
import Button from "components/UI/CustomButtons/Button";

const LandingPage = classes => {
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

export default LandingPage;
