import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useRef } from "react";
import { retrieveRefundById } from "../../../../redux/actions/refundAction";
import Card from "../../../UI/Card/Card";
import GridContainer from "../../../Layout/components/Grid/GridContainer";
import GridItem from "../../../Layout/components/Grid/GridItem";
import Divider from "@material-ui/core/Divider";
import OrderAddressCard from "../Orders/OrderAddressCard";
import ProductVariantCard from "../../../Reservation/View/ProductVariantCard";
import * as QRCode from "easyqrcodejs";
import Grid from "@material-ui/core/Grid";

const moment = require("moment");
const _ = require("lodash");
const jsog = require("jsog");

function RefundDetails(props) {
  const { mode, transactionId } = useParams();
  const dispatch = useDispatch();

  const refund = useSelector(state => state.refund.currRefund);

  const promoCode = _.get(
    refund,
    "refundLineItems[0].transactionLineItem.transaction.promoCode",
    {}
  );

  let amountBeforePromoCode = 0;
  const size = _.get(refund, "refundLineItems.length");
  console.log(size);
  if (size) {
    for (let i = 0; i < size; i++) {
      let li = _.get(refund, "refundLineItems");
      amountBeforePromoCode += li[i].totalPrice;
    }
  }

  console.log("AMT", amountBeforePromoCode);

  useEffect(() => {
    dispatch(retrieveRefundById(transactionId));
  }, [transactionId]);

  const refundStatusEnumMap = {
    PENDING: "PENDING",
    PROCESSING: "PROCESSING",
    PARTIALLY_COMPLETE: "PARTIALLY COMPLETE",
    COMPLETED: "COMPLETED",
    COMPLETED_WITH_REJECTED_PRODUCTS: "COMPLETED WITH REJECTED PRODUCTS",
    REJECTED: "REJECTED"
  };
  const status = refund ? refundStatusEnumMap[refund.refundStatus] : "";

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

  let refundMode = "";
  let refundModeDisplay = "";
  const refundModeEnum = refund ? refund.refundMode : "";
  switch (refundModeEnum) {
    case "IN_STORE":
      refundMode = "Store";
      refundModeDisplay = "In Store Refund";
      break;
    case "ONLINE":
      refundMode = "Online";
      refundModeDisplay = "Online Refund";
      break;
    default:
      refundMode = "";
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
      {refund && (
        <GridContainer>
          <GridItem
            md={12}
            style={{ backgroundColor: "lightgray", padding: "10px 15px" }}
          >
            <h4 style={{ margin: "0" }}>
              <span style={{ float: "left" }}>
                Refund <b>{refund.refundNumber}</b>
              </span>
              <span>
                &nbsp;of{" "}
                <b>
                  {moment(refund.refundDateTime).format("YYYY-DD-MM HH:mm")}
                </b>
                &nbsp; [{refundModeDisplay}]
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
            {refund.store ? (
              <>
                <h4>{refundMode} Address </h4>
                <Divider />
                <OrderAddressCard address={refund.store.address} />
              </>
            ) : (
              <>
                <h4>Warehouse Address </h4>
                <Divider />
                <OrderAddressCard address={refund.warehouse.address} />
              </>
            )}
          </GridItem>
          <GridItem md={4}></GridItem>
          <GridItem md={2} xs={12}>
            <QRCodeItem currRefund={refund} />
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
              Refund Items
              {promoCode && (
                <span style={{ float: "right" }}>
                  Promo Code Used:{" "}
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
              {refund.refundLineItems.map((lineItem, index) => {
                const val =
                  (lineItem.transactionLineItem.initialSubTotal *
                    lineItem.quantity) /
                  lineItem.transactionLineItem.quantity;
                return (
                  <GridItem md={12} key={index}>
                    <Divider light />
                    <GridContainer>
                      <GridItem md={8}>
                        <ProductVariantCard
                          key={
                            lineItem.transactionLineItem.productVariant
                              .productVariantId
                          }
                          productVariant={
                            lineItem.transactionLineItem.productVariant
                          }
                          quantity={lineItem.quantity}
                          // initialSubTotal={val}
                          initialSubTotal={
                            lineItem.transactionLineItem.finalSubTotal
                          }
                          finalSubTotal={val}
                        />
                      </GridItem>
                      <GridItem md={3}>
                        <h5 style={{ float: "right" }}>SGD${val.toFixed(2)}</h5>
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
                  <div>SGD$ {amountBeforePromoCode.toFixed(2)}</div>
                  <div>
                    ({promoCode.promoCodeName}) - SGD${" "}
                    {(amountBeforePromoCode - refund.refundAmount).toFixed(2)}
                    <Divider />
                  </div>
                </>
              )}
              <b>Refund Amount : </b> SGD$ {refund.refundAmount.toFixed(2)}
            </h5>
          </GridItem>
          <GridItem md={1} />
        </GridContainer>
      )}
    </Card>
  );
}

function QRCodeItem(props) {
  const { currRefund } = props;

  const refundNumber = currRefund.refundNumber;
  // const title = `${productName} (${colour}, ${size})`;
  const title = "lol";
  const options = {
    text: currRefund.refundId.toString(),
    // title: refundNumber,
    titleFont: "bold 22px Arial",
    titleHeight: 50,
    titleBackgroundColor: "#FBCEB1",
    subTitleColor: "black",
    width: 130,
    height: 130
  };

  const qrCodeRef = useRef(null);

  useEffect(() => {
    new QRCode(qrCodeRef.current, options);
  }, []);

  return (
    <div
      ref={qrCodeRef}
      style={{ pageBreakInside: "avoid", paddingTop: "10px", float: "right" }}
    />
  );
}

export default RefundDetails;
