import React from "react";
import Button from "components/UI/CustomButtons/Button";
import classNames from "classnames";
import GridItem from "components/Layout/components/Grid/GridItem";

function LandingPage(props) {
  const { classes } = props;
  return (
    <GridItem
      xs={12}
      sm={8}
      md={8}
      className={classNames(classes.mlAuto, classes.mrAuto, classes.textCenter)}
    >
      <h1 className={classes.title}>Fashion. Re-imagined.</h1>
      <h4>Reservations. Personalization. Convenience.</h4>
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
  );
}

export default LandingPage;
