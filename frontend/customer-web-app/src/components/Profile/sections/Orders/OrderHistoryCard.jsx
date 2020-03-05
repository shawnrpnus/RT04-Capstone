import React from "react";
import Card from "components/UI/Card/Card";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import GridItem from "components/Layout/components/Grid/GridItem";
import { Button } from "components/UI/CustomButtons/Button";
import ProductVariantCard from "components/Reservation/View/ProductVariantCard";
import Divider from "@material-ui/core/Divider";
import typographyStyle from "assets/jss/material-kit-pro-react/views/componentsSections/typographyStyle";
import { makeStyles } from "@material-ui/core/styles";
import FilterBar from "components/Shop/FilterBar";
import Drawer from "@material-ui/core/Drawer";

const _ = require("lodash");
const moment = require("moment");

const useTypoStyles = makeStyles(typographyStyle);

function OrderHistoryCard(props) {
  const { transaction } = props;

  const typoClasses = useTypoStyles();
  const deliveryStatusEnumMap = {
    PROCESSING: "Processing",
    IN_TRANSIT: "In Transit",
    DELIVERED: "Delivered"
  };
  const status =
    transaction.collectionMode === "IN_STORE"
      ? "Collected In Store"
      : deliveryStatusEnumMap[transaction.deliveryStatus];

  const statusColor =
    transaction.collectionMode === "IN_STORE" || status === "Delivered"
      ? "green"
      : status === "Processing"
      ? "red"
      : "amber";

  const lineItems = transaction.transactionLineItems;

  const productVariants = transaction.transactionLineItems.map(lineItem => {
    return lineItem.productVariant;
  });
  return (
    <Card
      plain
      style={{
        padding: "20px",
        margin: "10px 0",
        borderRadius: "0px"
      }}
    >
      <GridContainer>
        <GridItem md={12} xs={12}>
          <h5
            className={typoClasses.title}
            style={{ float: "left", margin: 0 }}
          >
            Order No: {transaction.orderNumber}
          </h5>
          <h5
            className={typoClasses.title}
            style={{ float: "right", color: statusColor, margin: 0 }}
          >
            {status}
          </h5>
        </GridItem>
        <GridItem md={12} xs={12}>
          <Divider variant="middle" />
          <GridContainer>
            <GridItem md={3} xs={12}>
              <h5>
                <b>Order Date: </b>
                <br />
                {moment(transaction.createdDateTime).format("YYYY-DD-MM HH:mm")}
              </h5>
              <h5>
                <b>Amount:</b>
                <br />${transaction.finalTotalPrice}
              </h5>
              <Button fullWidth color="success" style={{ float: "bottom" }}>
                View Order
              </Button>
            </GridItem>
            <GridItem
              md={9}
              xs={12}
              style={{ height: "200px", overflowY: "scroll" }}
            >
              {lineItems.map(lineItem => {
                return (
                  <ProductVariantCard
                    key={lineItem.productVariant.productVariantId}
                    productVariant={lineItem.productVariant}
                    quantity={lineItem.quantity}
                  />
                );
              })}
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
    </Card>
  );
}

export default OrderHistoryCard;
