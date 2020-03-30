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
const _ = require("lodash");

function OrderDetails(props) {
  const { mode, transactionId } = useParams();
  const dispatch = useDispatch();
  const transaction = useSelector(state => state.transaction.viewedTransaction);
  const promoCode = _.get(transaction, "promoCode", {});

  useEffect(() => {
    dispatch(retrieveTransactionById(transactionId));
  }, [transactionId]);

  const deliveryStatusEnumMap = {
    PROCESSING: "PROCESSING",
    TO_BE_DELIVERED: "PROCESSING",
    IN_TRANSIT: "IN TRANSIT",
    DELIVERED: "DELIVERED",
    COLLECTED: "COLLECTED",
    READY_FOR_COLLECTION: "READY FOR COLLECTION"
  };

  const status = transaction
    ? deliveryStatusEnumMap[transaction.deliveryStatus]
    : "";

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
                Status:{" "}
                <span style={{ color: statusColor, fontWeight: 400 }}>
                  {status}
                </span>
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
            <h4 style={{ margin: "0" }}>
              Ordered Items
              {promoCode && (
                <span style={{ float: "right" }}>
                  Promo Code:{" "}
                  <span style={{ fontWeight: 400 }}>
                    {promoCode.promoCodeName}
                  </span>
                </span>
              )}
            </h4>
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
                            ? lineItem.finalSubTotal.toFixed(2)
                            : lineItem.initialSubTotal.toFixed(2)}
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
            <h5 style={{ textAlign: "right" }}>
              {promoCode && (
                <>
                  <div>SGD$ {transaction.initialTotalPrice.toFixed(2)}</div>
                  <div>
                    ({promoCode.promoCodeName}) - SGD${" "}
                    {(
                      transaction.finalTotalPrice -
                      transaction.initialTotalPrice
                    ).toFixed(2)}
                    <Divider />
                  </div>
                </>
              )}
              <b>Grand Total : </b> SGD${" "}
              {transaction.finalTotalPrice.toFixed(2)}
            </h5>
          </GridItem>
          <GridItem md={1} />
        </GridContainer>
      )}
    </Card>
  );
}

export default OrderDetails;
