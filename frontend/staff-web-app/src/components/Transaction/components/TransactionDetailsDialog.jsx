import React from "react";
import { useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import dateformat from "dateformat";
import { useConfirm } from "material-ui-confirm";
import MaterialTable from "material-table";
import {
  AddBox,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn
} from "@material-ui/icons";
import { getDeliveryStatusColour } from "../../../redux/actions/restockOrderAction";

const _ = require("lodash");
const tableIcons = {
  Add: AddBox,
  Check: Check,
  Clear: Clear,
  Delete: DeleteOutline,
  DetailPanel: ChevronRight,
  Edit: Edit,
  Export: SaveAlt,
  Filter: Search,
  FirstPage: FirstPage,
  LastPage: LastPage,
  NextPage: ChevronRight,
  PreviousPage: ChevronLeft,
  ResetSearch: Clear,
  Search: Search,
  SortArrow: () => <div />,
  ThirdStateCheck: Remove,
  ViewColumn: ViewColumn
};

const TransactionDetailsDialog = ({ transaction, open, onClose }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const confirmDialog = useConfirm();

  const {
    transactionId,
    orderNumber,
    createdDateTime,
    collectionMode,
    totalQuantity,
    initialTotalPrice,
    finalTotalPrice,
    deliveryStatus,
    deliveryDateTime,
    promoCode,
    deliveryAddress,
    billingAddress,
    transactionLineItems,
    customer,
    storeToCollect
  } = transaction;

  const { firstName, lastName } = customer;
  const style = getDeliveryStatusColour(deliveryStatus.split("_").join(" "));
  let deliveryAddr, storeAddr, billingAddr;
  if (deliveryAddress && billingAddress) {
    const {
      line1: deliveryLine1,
      line2: deliveryLine2,
      postalCode: deliveryPostalCode
    } = deliveryAddress;
    const {
      line1: billingLine1,
      line2: billingLine2,
      postalCode: billingPostalCode
    } = billingAddress;
    deliveryAddr = `${deliveryLine1},${
      deliveryLine2 ? ` ${deliveryLine2},` : ""
    } ${deliveryPostalCode}`;
    billingAddr = `${billingLine1},${
      billingLine2 ? ` ${billingLine2},` : ""
    } ${billingPostalCode}`;
  } else if (storeToCollect) {
    const {
      line1: storeLine1,
      line2: storeLine2,
      postalCode: storePostalCode
    } = storeToCollect.address;
    storeAddr = `${storeLine1},${
      storeLine2 ? ` ${storeLine2},` : ""
    } ${storePostalCode}`;
  }
  const date = dateformat(new Date(createdDateTime), "dd'-'mmm'-'yyyy");

  const data = transactionLineItems.map(item => {
    const {
      transactionLineItemId,
      initialSubTotal,
      finalSubTotal,
      quantity,
      productVariant
    } = item;
    const { product, productImages } = productVariant;
    const { productName, productId } = product;
    return {
      transactionLineItemId,
      initialSubTotal,
      finalSubTotal,
      quantity,
      productName,
      productId,
      productImageUrl: productImages[0].productImageUrl
    };
  });

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth={"md"}>
      <DialogTitle style={{ textAlign: "center" }}>Order details</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs={12}>
            {customer && (
              <>
                <Typography style={{ fontWeight: "bold" }}>
                  {firstName} {lastName}
                </Typography>
                <br />
              </>
            )}
          </Grid>
          <br />
          <Grid item xs={6}>
            <div>Order number: {orderNumber}</div>
            <div> Order date: {date}</div>
            <div> Collection mode: {collectionMode.split("_").join(" ")}</div>
            {deliveryAddr && <div> Delivery Address: {deliveryAddr}</div>}
            {billingAddr && <div> Billing Address: {billingAddr}</div>}
            {storeAddr && <div> Collection Address: {storeAddr}</div>}
          </Grid>
          <Grid item xs={6} style={{ textAlign: "right" }}>
            <Chip
              style={{ ...style, color: "white", marginBottom: "1%" }}
              label={deliveryStatus.split("_").join(" ")}
            />
            {promoCode && <div> Promo code: {promoCode.promoCodeName}</div>}
          </Grid>
        </Grid>
        <MaterialTable
          title=""
          style={{ boxShadow: "none" }}
          icons={tableIcons}
          columns={[
            { title: "Transaction ID", field: "transactionLineItemId" },
            { title: "Product name", field: "productName" },

            {
              title: "Delivery status",
              field: "deliveryStatus",
              render: ({ productImageUrl, productId }) => (
                <Link to={`/product/viewProductDetails/${productId}`}>
                  <img
                    style={{
                      width: "60%",
                      borderRadius: "10%"
                    }}
                    src={productImageUrl}
                  />
                </Link>
              )
            },
            {
              title: "Quantity",
              field: "quantity"
            },
            { title: "Original Subtotal", field: "initialSubTotal" },
            {
              title: "Discounted Subtotal",
              field: "finalSubTotal",
              emptyValue: "NA"
            }
          ]}
          data={data}
          options={{
            paging: false,
            headerStyle: { textAlign: "center" }, //change header padding
            cellStyle: { textAlign: "center" },
            draggable: false,
            actionsColumnIndex: -1
          }}
        />
      </DialogContent>
      <DialogActions style={{ marginRight: "24px" }}>
        <Grid container style={{ textAlign: "right" }}>
          {promoCode && (
            <>
              <Grid item xs={11}>
                <Typography style={{ fontWeight: "bold" }}>
                  Initial total price :
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography style={{ fontWeight: "bold" }}>
                  ${initialTotalPrice.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={11}>
                <Typography style={{ fontWeight: "bold" }}>
                  ({promoCode.promoCodeName}) :
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography style={{ fontWeight: "bold" }}>
                  - ${(initialTotalPrice - finalTotalPrice).toFixed(2)}
                </Typography>
              </Grid>
              <Divider />
            </>
          )}
          <Grid item xs={11}>
            <Typography style={{ fontWeight: "bold" }}>
              Final total price :
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography style={{ fontWeight: "bold" }}>
              ${finalTotalPrice.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      </DialogActions>
      <DialogActions>
        <Button autoFocus onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionDetailsDialog;
