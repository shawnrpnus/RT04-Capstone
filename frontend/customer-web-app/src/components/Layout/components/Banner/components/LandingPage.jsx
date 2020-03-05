import React from "react";
import Button from "components/UI/CustomButtons/Button";
import classNames from "classnames";
import GridItem from "components/Layout/components/Grid/GridItem";
import { Link } from "react-router-dom";

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
        <Link to="/account/login">
          <Button
            color="white"
            size="lg"
            style={{ width: "125px", opacity: "0.9", marginRight: "2px" }}
          >
            Login
          </Button>
        </Link>
      </div>
    </GridItem>
  );
}

export default LandingPage;
