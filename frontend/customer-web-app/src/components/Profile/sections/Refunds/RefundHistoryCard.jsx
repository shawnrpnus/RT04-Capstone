import { makeStyles } from "@material-ui/core/styles";
import typographyStyle from "../../../../assets/jss/material-kit-pro-react/views/componentsSections/typographyStyle";
import {useHistory} from "react-router-dom";
import Card from "../../../UI/Card/Card";
import React from "react";
import GridItem from "../../../Layout/components/Grid/GridItem";
import Divider from "@material-ui/core/Divider";
import GridContainer from "../../../Layout/components/Grid/GridContainer";
import {Button} from "../../../UI/CustomButtons/Button";
import ProductVariantCard from "../../../Reservation/View/ProductVariantCard";


const _ = require("lodash");
const moment = require("moment");
const useTypoStyles = makeStyles(typographyStyle);
const jsog = require("jsog");

function RefundHistoryCard(props) {
  const typoClasses = useTypoStyles();
  const history = useHistory();
  const { currRefund } = props;
  const refundStatusEnumMap = {
    PENDING: "PENDING",
    PROCESSING: "PROCESSING",
    PARTIALLY_COMPLETE: "PARTIALLY COMPLETE",
    COMPLETED: "COMPLETED",
    COMPLETED_WITH_REJECTED_PRODUCTS: "COMPLETED WITH REJECTED PRODUCTS",
    REJECTED: "REJECTED"
  };
  const status = refundStatusEnumMap[currRefund.refundStatus];

  let statusColor;
  switch (status) {
    case "REJECTED":
      statusColor = "red";
      break;
    case "PARTIALLY COMPLETE":
      statusColor = "green";
      break;
    case "COMPLETED":
      statusColor = "green";
      break;
    case "COMPLETED WITH REJECTED PRODUCTS":
      statusColor = "green";
      break;
    default:
      statusColor = "sandybrown";
  }

  const lineItems = currRefund.refundLineItems;

  const generateQR = () => {
    // const productStockIds = rowData.map(row => row.productStockId);
    const productStocksToGenerateQR = currRefund.refundId;
    localStorage.setItem(
      "productStocks",
      jsog.stringify(productStocksToGenerateQR)
    );
    window.open(`${process.env.PUBLIC_URL}/account/profile/viewRefund/${currRefund.refundId}`);
  };

  const handleViewDetails = () => {
    // generateQR();
    history.push(
      `/account/profile/viewRefund/${currRefund.refundId}`
    )
  };

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
            Refund No: {currRefund.refundNumber}
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
                <b>Refund Date: </b>
                <br />
                {moment(currRefund.refundDateTime).format("YYYY-DD-MM HH:mm")}
              </h5>
              <h5>
                <b>Amount:</b>
                <br />${currRefund.refundAmount}
              </h5>
              <Button
                fullWidth
                color="success"
                style={{ float: "bottom" }}
                onClick={() =>
                  handleViewDetails()
                }
              >
                View Refund
              </Button>
            </GridItem>
            <GridItem
              md={9}
              xs={12}
              style={{ height: "200px", overflowY: "scroll" }}
            >
              {lineItems.map(lineItem => {
                const val = lineItem.transactionLineItem.initialSubTotal * lineItem.quantity/lineItem.transactionLineItem.quantity;
                return (
                  <ProductVariantCard
                    key={lineItem.transactionLineItem.productVariant.productVariantId}
                    productVariant={lineItem.transactionLineItem.productVariant}
                    quantity={lineItem.quantity}
                    initialSubTotal={val}
                    finalSubTotal={lineItem.transactionLineItem.finalSubTotal}
                  />
                );
              })}
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
    </Card>
  )
}

export default RefundHistoryCard;
