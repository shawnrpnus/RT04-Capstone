import { makeStyles, withStyles } from "@material-ui/core/styles";
import headersStyle from "assets/jss/material-kit-pro-react/views/sectionsSections/headersStyle";
import React, { useState } from "react";
import Hidden from "@material-ui/core/Hidden";
import Button from "components/UI/CustomButtons/Button";
import Tooltip from "@material-ui/core/Tooltip";
import { Link } from "react-router-dom";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import colours from "assets/colours";
import Card from "components/UI/Card/Card";
import GridItem from "components/Layout/components/Grid/GridItem";
import { useSelector } from "react-redux";
import { Event } from "@material-ui/icons";

const _ = require("lodash");
const useHeaderStyles = makeStyles(headersStyle);

function ReservationNavbar(props) {
  const classes = useHeaderStyles();
  const { category } = props;
  return (
    <React.Fragment>
      <Hidden smDown className={classes.hidden}>
        <ReservationToolTip classes={classes} category={category} />
      </Hidden>
      <Hidden mdUp className={classes.hidden}>
        <Link to="/account/reservation/cart" style={{ color: "inherit" }}>
          <Button className={classes.navLink} round color="transparent">
            <Event className={classes.icons} /> Reservation
          </Button>
        </Link>
      </Hidden>
    </React.Fragment>
  );
}

// Renders the button that when hovered, activates the tooltip
function ReservationToolTip(props) {
  const { classes, category } = props;
  const [open, setOpen] = useState(false);
  const tooltipOpen = useSelector(
    state => state.customer.reservationTooltipOpen
  );
  return (
    <React.Fragment>
      <HtmlTooltip
        // open={category.categoryName === "Men"}
        title={<ReservationTooltipContent rootCategory={category} />}
        interactive
        open={tooltipOpen || open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
      >
        <Link to="/account/reservation/cart" style={{ color: "inherit" }}>
          <Button className={classes.navLink} round color="transparent">
            <Event className={classes.icons} /> Reservation
          </Button>
        </Link>
      </HtmlTooltip>
    </React.Fragment>
  );
}

// Renders tooltip content after hovering button
function ReservationTooltipContent(props) {
  const customer = useSelector(state => state.customer.loggedInCustomer);
  return (
    <React.Fragment>
      {customer && customer.reservationCartItems.length > 0 ? (
        <GridContainer style={{ width: "105%" }}>
          <GridItem xs={12} style={{ maxHeight: "70vh", overflowY: "scroll" }}>
            {customer.reservationCartItems.map(productVariant => (
              <ReservationItemCard
                key={productVariant.productVariantId}
                productVariant={productVariant}
              />
            ))}
          </GridItem>
        </GridContainer>
      ) : (
        <h5 style={{ color: "black", textAlign: "center" }}>
          Your reservation cart is empty. <br />
          Add items to get started!
        </h5>
      )}
    </React.Fragment>
  );
}

function ReservationItemCard(props) {
  const colorNames = _.keyBy(colours, "hex");
  const { productVariant } = props;
  const imageUrl = productVariant.productImages[0].productImageUrl;
  const productName = productVariant.product.productName;
  const color = colorNames[productVariant.colour].name;
  const size = productVariant.sizeDetails.productSize;
  const price = productVariant.product.price;
  const discountedPrice = productVariant.product.discountedPrice;
  return (
    <Card plain style={{ margin: "10px 0" }}>
      <GridContainer style={{ margin: 0 }}>
        <GridItem xs={4} style={{ paddingLeft: 0 }}>
          <img height="auto" width="100%" src={imageUrl} alt="ProdImage" />
        </GridItem>
        <GridItem xs={8} style={{ padding: 0 }}>
          <GridContainer>
            <GridItem xs={12} style={{ marginBottom: "3px" }}>
              {productName}
            </GridItem>
            <GridItem
              xs={12}
              style={{ fontWeight: "lighter", marginBottom: "2px" }}
            >
              {color}, {size}
            </GridItem>
            <GridItem xs={5} style={{ fontWeight: "lighter" }}>
              Price
            </GridItem>
            <GridItem xs={7} style={{ fontWeight: "lighter" }}>
              ${discountedPrice ? discountedPrice : price}
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
    </Card>
  );
}

export { ReservationNavbar };

const HtmlTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: "white",
    //color: "rgba(0, 0, 0, 0.87)",
    maxWidth: "350px",
    fontSize: theme.typography.pxToRem(14),
    border: "1px solid #F0F0F0",
    borderRadius: "0",
    minWidth: "350px",
    padding: "10px",
    marginTop: "30px"
  }
}))(Tooltip);
