import React, { useEffect, useState } from "react";
import Card from "components/UI/Card/Card";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import GridItem from "components/Layout/components/Grid/GridItem";
import { Button } from "components/UI/CustomButtons/Button";
import ProductVariantCard from "components/Reservation/View/ProductVariantCard";
import Divider from "@material-ui/core/Divider";
import typographyStyle from "assets/jss/material-kit-pro-react/views/componentsSections/typographyStyle";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import CreateRefund from "../Refunds/CreateRefund";
import { retrieveTransactionById } from "../../../../redux/actions/transactionActions";
import { useDispatch, useSelector } from "react-redux";
import { retrieveRefundsByTransactionId } from "../../../../redux/actions/refundAction";
import { emailSent } from "../../../../redux/actions/customerActions";
import Tooltip from "@material-ui/core/Tooltip";
import tooltipsStyle from "../../../../assets/jss/material-kit-pro-react/tooltipsStyle";

const _ = require("lodash");
const moment = require("moment");

const useToolTipStyles = makeStyles(tooltipsStyle);
const useTypoStyles = makeStyles(typographyStyle);

function OrderHistoryCard(props) {
  const { transaction } = props;
  const history = useHistory();
  const typoClasses = useTypoStyles();
  const toolTipClasses = useToolTipStyles();
  const dispatch = useDispatch();
  const deliveryStatusEnumMap = {
    PROCESSING: "PROCESSING",
    TO_BE_DELIVERED: "PROCESSING",
    IN_TRANSIT: "IN TRANSIT",
    DELIVERED: "DELIVERED",
    COLLECTED: "COLLECTED",
    READY_FOR_COLLECTION: "READY FOR COLLECTION",
  };

  const [largeModal, setLargeModal] = React.useState(false);
  const [totalForEachItem, setTotalForEachItem] = useState([]);
  const [isRefundable, setIsRefundable] = useState(false);
  const [textToDisplay, setTextToDisplay] = useState("Unhappy with our goods? Make a refund!");

  useEffect( () => {
    setIsRefundable(checkRefundable(transaction));
  },[transaction]);

  console.log(totalForEachItem);

  const checkRefundable = (transaction) => {
    if (!transaction) {
      return false;
    }
    let toRefund = false;

    setTotalForEachItem(new Array(transaction.transactionLineItems.length).fill(0));
    let total = new Array(transaction.transactionLineItems.length).fill(0);
    for (let i = 0; i < transaction.transactionLineItems.length; i++) {
      for (
        let j = 0;
        j < transaction.transactionLineItems[i].refundLineItems.length;
        j++
      ) {
        total[i] +=
          transaction.transactionLineItems[i].refundLineItems[j].quantity;
        setTotalForEachItem(total);
      }
    }

    if (
      transaction.deliveryStatus !== "DELIVERED" &&
      transaction.deliveryStatus !== "COLLECTED"
    ) {
      setTextToDisplay("Delivery not available");
      setIsRefundable(false);
      return false;
    }

    if (transaction.deliveredDateTime) {
      let datePastRefund = new Date(transaction.deliveredDateTime);
      datePastRefund.setDate(datePastRefund.getDate() + 14);
      if (datePastRefund < new Date()) {
        toRefund = false;
        setTextToDisplay("Refund Date Exceeded");
        setIsRefundable(false);
        return toRefund;
      }
    }

    //no refund before
    if (totalForEachItem === 0) {
      toRefund = true;
      setIsRefundable(true);
      return toRefund;
    }

    for (let i = 0; i < transaction.transactionLineItems.length; i++) {
      let val = total[i];
      if (transaction.transactionLineItems[i].quantity > val) {
        toRefund = true;
        setIsRefundable(true);
        return toRefund;
      }
    }
    // cannot refund because max liao
    return toRefund;
  };
  const status = deliveryStatusEnumMap[transaction.deliveryStatus];

  let statusColor;
  switch (status) {
    case "PROCESSING":
      statusColor = "red";
      break;
    case "DELIVERED":
      statusColor = "green";
      break;
    case "COLLECTED":
      statusColor = "green";
      break;
    default:
      statusColor = "sandybrown";
  }

  const lineItems = transaction.transactionLineItems;


  const openModal = (transactionId) => {
    setLargeModal(true);
    dispatch(retrieveTransactionById(transactionId));
  };

  return (
    <Card
      plain
      style={{
        padding: "20px",
        margin: "10px 0",
        borderRadius: "0px",
      }}
    >
      <GridContainer>
        <CreateRefund
          largeModal={[largeModal, setLargeModal]}
          transactionId={transaction.transactionId}
          totalForEachItem={totalForEachItem}
        />
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
                <br />${transaction.finalTotalPrice.toFixed(2)}
              </h5>
              <Button
                fullWidth
                color="success"
                style={{ float: "bottom" }}
                onClick={() =>
                  history.push(
                    `/account/profile/viewOrder/${transaction.transactionId}`
                  )
                }
              >
                View Order
              </Button>
              <Tooltip
                id="tooltip-right"
                title={textToDisplay}
                placement="right"
                classes={{ tooltip: toolTipClasses.tooltip }}
              >
                <span>
                  <Button
                    fullWidth
                    color="primary"
                    style={{ float: "bottom" }}
                    onClick={() => openModal(transaction.transactionId)}
                    disabled={!isRefundable}
                  >
                    Make a Refund
                  </Button>
                </span>
              </Tooltip>
            </GridItem>
            <GridItem
              md={9}
              xs={12}
              style={{ height: "200px", overflowY: "scroll" }}
            >
              {lineItems.map((lineItem) => {
                return (
                  <ProductVariantCard
                    key={lineItem.productVariant.productVariantId}
                    productVariant={lineItem.productVariant}
                    quantity={lineItem.quantity}
                    initialSubTotal={lineItem.initialSubTotal}
                    finalSubTotal={lineItem.finalSubTotal}
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
