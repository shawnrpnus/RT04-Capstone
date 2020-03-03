import React, { useState } from "react";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import GridItem from "components/Layout/components/Grid/GridItem";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import { CancelOutlined, DeleteSharp, Edit } from "@material-ui/icons";
import { Button } from "components/UI/CustomButtons/Button";
import Popper from "@material-ui/core/Popper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import Card from "components/UI/Card/Card";
import makeStyles from "@material-ui/core/styles/makeStyles";
import wishlistStyle from "assets/jss/material-kit-pro-react/views/wishlistStyle";
import ProductVariantCard from "components/Reservation/View/ProductVariantCard";
import Divider from "@material-ui/core/Divider";

const _ = require("lodash");
const moment = require("moment");
const useStyles = makeStyles(wishlistStyle);

function ReservationItem(props) {
  const classes = useStyles();
  const { reservation } = props;

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const { store } = reservation;
  const { address } = store;
  return (
    <Card plain>
      <GridContainer style={{ textAlign: "left", alignItems: "center" }}>
        <GridItem md={5} xs={12}>
          <GridContainer>
            <GridItem md={12}>
              <h3 className={classes.title}>
                {moment(reservation.reservationDateTime).format("D MMM h:mm A")}
              </h3>
            </GridItem>
            <GridItem md={12}>
              {/*<h3 style={{ marginTop: "10px" }}>Location</h3>*/}
              <h4>{store.storeName}</h4>
              <h4>{`${address.buildingName}, ${address.line1} ${address.line2} ${address.postalCode}`}</h4>
            </GridItem>
            <GridItem md={12}>
              <Button color="primary">
                <Edit />
                Update
              </Button>
              <Button color="danger">
                <DeleteSharp />
                Cancel
              </Button>
            </GridItem>
          </GridContainer>
        </GridItem>
        <GridItem
          md={7}
          xs={12}
          style={{ height: "200px", overflowY: "scroll" }}
        >
          {reservation.productVariants.map(productVariant => (
            <React.Fragment>
              <ProductVariantCard productVariant={productVariant} />
              <Divider />
            </React.Fragment>
          ))}
        </GridItem>
        <Popper
          open={popoverOpen}
          anchorEl={anchorEl}
          style={{ zIndex: "2000" }}
          placement="top"
        >
          <ClickAwayListener onClickAway={() => setPopoverOpen(false)}>
            <Paper style={{ padding: "5px" }}>
              <h5 style={{ textAlign: "center", marginBottom: "0" }}>
                Remove?
              </h5>
              <Button color="danger">Yes</Button>
              <Button onClick={() => setPopoverOpen(false)}>No</Button>
            </Paper>
          </ClickAwayListener>
        </Popper>
      </GridContainer>
    </Card>
  );
}

export default ReservationItem;
