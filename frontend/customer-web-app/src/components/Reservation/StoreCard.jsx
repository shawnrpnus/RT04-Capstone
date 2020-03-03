import React from "react";
import Card from "components/UI/Card/Card";
import CardHeader from "components/UI/Card/CardHeader";
import CardBody from "components/UI/Card/CardBody";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import { CancelOutlined } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import wishlistStyle from "assets/jss/material-kit-pro-react/views/wishlistStyle";

const useStyles = makeStyles(wishlistStyle);

function StoreCard(props) {
  const classes = useStyles();
  const { storeWithStock } = props;
  const { store, stockStatus } = storeWithStock;
  const { address } = store;
  return (
    <Card plain style={{ margin: "0" }}>
      <CardHeader className={classes.title} style={{ paddingBottom: 0 }}>
        {store.storeName}
      </CardHeader>
      <CardBody style={{ paddingBottom: "0" }}>
        {`${address.buildingName}, ${address.line1} ${address.line2} ${address.postalCode}`}
        <br />
        {`Hours: ${store.openingTime.substring(
          0,
          5
        )} - ${store.closingTime.substring(0, 5)}`}
        <h6
          style={{
            display: "flex",
            alignItems: "center"
          }}
        >
          {stockStatus === "In stock" ? (
            <React.Fragment>
              <CheckCircleOutlineIcon style={{ fill: "green" }} /> In stock
            </React.Fragment>
          ) : stockStatus === "Partially in stock" ? (
            <React.Fragment>
              <CheckCircleOutlineIcon style={{ fill: "orange" }} /> Partially in
              stock
            </React.Fragment>
          ) : stockStatus === "Out of stock" ? (
            <React.Fragment>
              <CancelOutlined style={{ fill: "red" }} /> Out of stock
            </React.Fragment>
          ) : null}
        </h6>
      </CardBody>
    </Card>
  );
}

export default StoreCard;
