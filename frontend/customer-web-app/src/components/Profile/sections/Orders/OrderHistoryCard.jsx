import React from "react";
import Card from "components/UI/Card/Card";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import GridItem from "components/Layout/components/Grid/GridItem";
import { Button } from "components/UI/CustomButtons/Button";

const _ = require("lodash");
const moment = require("moment");

function OrderHistoryCard(props) {
  const { transaction } = props;

  const deliveryStatusEnumMap = {
    PROCESSING: "Processing",
    IN_TRANSIT: "In Transit",
    DELIVERED: "Delivered"
  };
  const status =
    transaction.collectionMode === "IN_STORE"
      ? "Collected In Store"
      : deliveryStatusEnumMap[transaction.deliveryStatus];
  const imageUrls = transaction.transactionLineItems.map(lineItem => {
    return _.get(lineItem, "productVariant.productImages[0].productImageUrl");
  });
  return (
    <Card plain>
      <GridContainer>
        <GridItem md={12} xs={12}>
          <h5 style={{ float: "left" }}>Order No: {transaction.orderNumber}</h5>
          <h5 style={{ float: "right" }}>{status}</h5>
        </GridItem>
        <GridItem md={4} xs={12}>
          <h5>
            Order Date:{" "}
            {moment(transaction.createdDateTime).format("YYYY-DD-MM HH:mm")}
            Amount: ${transaction.finalTotalPrice}
          </h5>
          <Button color="primary">View Order</Button>
        </GridItem>
        <GridItem md={8} xs={12}>
          <GridContainer>
            {imageUrls.map(imageUrl => {
              return (
                <GridItem xs>
                  <img
                    src={imageUrl}
                    alt="prodVarImage"
                    style={{ width: "100%", height: "auto" }}
                  />
                </GridItem>
              );
            })}
          </GridContainer>
        </GridItem>
      </GridContainer>
    </Card>
  );
}

export default OrderHistoryCard;
