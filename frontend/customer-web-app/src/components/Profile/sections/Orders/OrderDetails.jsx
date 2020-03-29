import React, { useEffect } from "react";
import Card from "components/UI/Card/Card";
import GridItem from "components/Layout/components/Grid/GridItem";
import GridContainer from "components/Layout/components/Grid/GridContainer";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { retrieveTransactionById } from "redux/actions/transactionActions";
import ProductVariantCard from "components/Reservation/View/ProductVariantCard";
import Divider from "@material-ui/core/Divider";
import OrderAddressCard from "components/Profile/sections/Orders/OrderAddressCard";

const moment = require("moment");

function OrderDetails(props) {
  const { mode, transactionId } = useParams();
  const dispatch = useDispatch();
  const transaction = useSelector(state => state.transaction.viewedTransaction);

  useEffect(() => {
    dispatch(retrieveTransactionById(transactionId));
  }, [transactionId]);

  const deliveryStatusEnumMap = {
    PROCESSING: "Processing",
    IN_TRANSIT: "In Transit",
    DELIVERED: "Delivered"
  };

  let status = "";
  let statusColor = "";
  if (transaction) {
    status =
      transaction.collectionMode === "IN_STORE"
        ? "Collected In Store"
        : deliveryStatusEnumMap[transaction.deliveryStatus];

    statusColor =
      transaction.collectionMode === "IN_STORE" || status === "Delivered"
        ? "green"
        : status === "Processing"
        ? "red"
        : "amber";
  }

  console.log(status);
  return (
    <Card
      plain
      style={{
        padding: "20px",
        margin: "10px 0",
        borderRadius: "0px"
      }}
    >
      {transaction && (
        <GridContainer>
          <GridItem
            md={12}
            style={{ backgroundColor: "lightgray", padding: "10px 15px" }}
          >
            <h4 style={{ margin: "0" }}>
              <span style={{ float: "left" }}>
                Order <b>{transaction.orderNumber}</b>
              </span>
              <span>
                &nbsp;of{" "}
                <b>
                  {moment(transaction.createdDateTime).format(
                    "YYYY-DD-MM HH:mm"
                  )}
                </b>
              </span>
              <span style={{ float: "right" }}>
                Status: <span style={{ color: statusColor }}>{status}</span>
              </span>
            </h4>
          </GridItem>
          <GridItem md={6} xs={12}>
            {transaction.storeToCollect ? (
              <>
                <h4>Collection address</h4>
                <Divider />
                <OrderAddressCard
                  address={transaction.storeToCollect.address}
                />
              </>
            ) : (
              <>
                <h4>Shipping Address</h4>
                <Divider />
                <OrderAddressCard address={transaction.deliveryAddress} />
              </>
            )}
          </GridItem>
          <GridItem md={6} xs={12}>
            {!transaction.storeToCollect && (
              <>
                <h4>Billing Address</h4>
                <Divider />
                <OrderAddressCard address={transaction.billingAddress} />
              </>
            )}
          </GridItem>
          <GridItem
            md={12}
            xs={12}
            style={{
              backgroundColor: "lightgray",
              padding: "10px 15px",
              marginTop: "15px"
            }}
          >
            <h4 style={{ margin: "0" }}>Ordered Items</h4>
          </GridItem>
          <GridItem md={12} xs={12}>
            <GridContainer>
              <GridItem md={4}>
                <h5 style={{ textAlign: "center" }}>
                  <b>Item</b>
                </h5>
              </GridItem>
              <GridItem md={4} />
              <GridItem md={3}>
                <h5 style={{ float: "right" }}>
                  <b>Subtotal</b>
                </h5>
              </GridItem>
              <GridItem md={1} />
              {transaction.transactionLineItems.map((lineItem, index) => {
                return (
                  <GridItem md={12} key={index}>
                    <Divider light />
                    <GridContainer>
                      <GridItem md={8}>
                        <ProductVariantCard
                          key={lineItem.productVariant.productVariantId}
                          productVariant={lineItem.productVariant}
                          quantity={lineItem.quantity}
                          initialSubTotal={lineItem.initialSubTotal}
                          finalSubTotal={lineItem.finalSubTotal}
                          detail={true}
                        />
                      </GridItem>
                      <GridItem md={3}>
                        <h5 style={{ float: "right" }}>
                          SGD${" "}
                          {lineItem.finalSubTotal
                            ? lineItem.finalSubTotal
                            : lineItem.initialSubTotal}
                        </h5>
                      </GridItem>
                      <GridItem md={1} />
                    </GridContainer>
                  </GridItem>
                );
              })}
            </GridContainer>
            <Divider />
          </GridItem>
          <GridItem md={8} />
          <GridItem md={3}>
            <h5 style={{ float: "right" }}>
              <b>Grand Total: </b>SGD$ {transaction.finalTotalPrice}
            </h5>
          </GridItem>
          <GridItem md={1} />
        </GridContainer>
      )}
    </Card>
  );
}

export default OrderDetails;
