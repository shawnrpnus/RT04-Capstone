import withPage from "../Layout/page/withPage";
import React, { useEffect, useState } from "react";
import {useHistory, useParams} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { retrieveRefundById } from "../../redux/actions/refundAction";
import { Grid, lighten } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import MaterialTextField from "../../shared/components/Form/MaterialTextField";
import TextField from "@material-ui/core/TextField";

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
import { clearErrors } from "../../redux/actions";
import MaterialTable from "material-table";
import CircularProgress from "@material-ui/core/CircularProgress";
import makeStyles from "@material-ui/core/styles/makeStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import LinearProgress from "@material-ui/core/LinearProgress";
import Chip from "@material-ui/core/Chip";

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
const BorderLinearProgress = withStyles({
  root: {
    height: 10,
    backgroundColor: lighten("#00e600", 0.5)
  },
  bar: {
    borderRadius: 20,
    backgroundColor: "#00e600"
  }
})(LinearProgress);

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  margin: {
    margin: theme.spacing(1)
  }
}));
const _ = require("lodash");

const ViewRefundRecordDetails = props => {
  const classes = useStyles();
  const { refundId } = useParams();
  const { renderLoader } = props;
  const dispatch = useDispatch();
  const history = useHistory();

  const errors = useSelector(state => state.errors);

  const [isLoading, setIsLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const currRefund = useSelector(state => state.refund.currRefund);

  //State
  const [inputState, setInputState] = useState({
    quantity: 0,
    refundAmt: 0,
    refundAmount: 0,
    refundMode: "",
    refundStatus: "",
    refundLabelCode: "",
    refundDateTime: "",
    reason: "",
    transactionOrderNumber: "",
    quantityToRefund: new Array(12).fill(0),
    customerId: "",
    refundNumber: "",
    refundProgress: "",
    customerName: "",
    email: "",
    promoCodeName: "",
    promoCodeDiscount: ""
  });
  const [currTransaction, setCurrTransaction] = useState(null);

  const onChange = e => {
    e.persist();
    setInputState(inputState => ({
      ...inputState,
      [e.target.name]: e.target.value
    }));
    if (Object.keys(errors).length !== 0) {
      dispatch(clearErrors());
    }
  };

  //Make API call to retrieve single prod from url param
  useEffect(() => {
    setIsLoading(true);
    setDisabled(true);
    dispatch(retrieveRefundById(refundId, setIsLoading, history));
  }, [refundId]);

  const calculateAmountBeforePromoCode = (refund) => {
    const size = _.get(refund, "refundLineItems.length");
    let amountBeforePromoCode = 0;
    if (size) {
      for (let i = 0; i < size; i++) {
        let li = _.get(refund, "refundLineItems");
        amountBeforePromoCode += li[i].totalPrice;
      }
    }
    const val = (amountBeforePromoCode- refund.refundAmount).toFixed(2);
    if(val <= 0.00) {
      console.log("inside lol");
      return "-";
    }
    return val;
  };

  useEffect(() => {
    if (currRefund !== null) {
      setCurrTransaction(
        _.get(currRefund, "refundLineItems[0].transactionLineItem.transaction")
      );

      setInputState(inputState => ({
        ...inputState,
        reason: currRefund.reason,
        refundNumber: currRefund.refundNumber,
        refundStatus: currRefund.refundStatus,
        refundMode: currRefund.refundMode,
        refundAmount: currRefund.refundAmount,
        quantity: currRefund.quantity,
        customerName:
          currRefund.customer.firstName + " " + currRefund.customer.lastName,
        email: currRefund.customer.email,
        promoCodeDiscount: calculateAmountBeforePromoCode(currRefund)
      }));
    }
  }, [currRefund]);

  useEffect(() => {
    console.log("what is curr transaction",currTransaction);
    if (currTransaction != null) {
      setInputState(inputState => ({
        ...inputState,
        promoCodeName: currTransaction.promoCode
          ? currTransaction.promoCode.promoCodeName
          : "-",
        // promoCodeDiscount: _.get(currTransaction, "promoCode.flatDiscount")
        //   ? "$" + _.get(currTransaction, "promoCode.flatDiscount")
        //   : _.get(currTransaction, "promoCode.percentageDiscount")
        //   ? _.get(currTransaction, "promoCode.percentageDiscount") + "%"
        //   : "-"
      }));
    }
  }, [currTransaction]);

  return (
    <div>
      <div>
        <h4>View Refund Record</h4>
      </div>
      {currRefund ? (
        <form className="material-form">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <MaterialTextField
                fieldLabel="Refund Number"
                fieldName="refundNumber"
                state={inputState}
                autoFocus={true}
                disabled={disabled}
                onChange={onChange}
                errors={errors}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <MaterialTextField
                fieldLabel="Refund Status"
                fieldName="refundStatus"
                state={inputState}
                autoFocus={true}
                disabled={disabled}
                onChange={onChange}
                errors={errors}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <MaterialTextField
                fieldLabel="Refund Mode"
                fieldName="refundMode"
                state={inputState}
                autoFocus={true}
                disabled={disabled}
                onChange={onChange}
                errors={errors}
              />
            </Grid>
            {/*<Grid item xs={12} md={2}>*/}
            {/*  <MaterialTextField*/}
            {/*    fieldLabel="Total Amount"*/}
            {/*    fieldName="refundAmount"*/}
            {/*    state={inputState}*/}
            {/*    autoFocus={true}*/}
            {/*    disabled={disabled}*/}
            {/*    onChange={onChange}*/}
            {/*    errors={errors}*/}
            {/*  />*/}
            {/*</Grid>*/}
            {/*<Grid item xs={12} md={2}>*/}
            {/*  <MaterialTextField*/}
            {/*    fieldLabel="Quantity"*/}
            {/*    fieldName="quantity"*/}
            {/*    state={inputState}*/}
            {/*    autoFocus={true}*/}
            {/*    disabled={disabled}*/}
            {/*    onChange={onChange}*/}
            {/*    errors={errors}*/}
            {/*  />*/}
            {/*</Grid>*/}
            <Grid item xs={12} md={4}>
              <MaterialTextField
                fieldLabel="Customer"
                fieldName="customerName"
                state={inputState}
                autoFocus={true}
                disabled={disabled}
                onChange={onChange}
                errors={errors}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <MaterialTextField
                fieldLabel="Email"
                fieldName="email"
                state={inputState}
                autoFocus={true}
                disabled={disabled}
                onChange={onChange}
                errors={errors}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <MaterialTextField
                fieldLabel="Reason"
                fieldName="reason"
                state={inputState}
                autoFocus={true}
                disabled={disabled}
                onChange={onChange}
                errors={errors}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              {currRefund ? (
                <MaterialTable
                  title="Refund Details"
                  style={{ boxShadow: "none" }}
                  icons={tableIcons}
                  columns={[
                    {
                      title: "Image",
                      field: "image",
                      render: rowData => (
                        <img
                          style={{
                            width: "50%",
                            borderRadius: "10%"
                          }}
                          src={
                            rowData.transactionLineItem.productVariant
                              .productImages[0].productImageUrl
                          }
                        />
                      )
                    },
                    {
                      title: "Product Name",
                      field:
                        "transactionLineItem.productVariant.product.productName"
                    },
                    {
                      title: "Size",
                      field:
                        "transactionLineItem.productVariant.sizeDetails.productSize"
                    },
                    {
                      title: "Unit Price",
                      field: "unitPrice"
                    },
                    {
                      title: "Refund Quantity",
                      field: "quantity"
                    },
                    // {
                    //   title: "Refund Amount",
                    //   field: "totalPrice"
                    // },
                    {
                      title: "Refund Progress",
                      field: "refundProgress",
                      render: rowData => {
                        // console.log(rowData);
                        const length = rowData.refundLineItemHandlerList.length;
                        const progress =
                          rowData.refundLineItemHandlerList[length - 1]
                            .refundProgressEnum;
                        let valWords = "";
                        let style = { backgroundColor: "#f65a5a" };
                        // console.log("progress",progress);
                        switch (progress) {
                          case "PENDING_DELIVERY":
                            style = { backgroundColor: "#19d2d2" };
                            valWords = "Pending Delivery";
                            break;
                          case "RECEIVED_BY_STORE":
                            style = { backgroundColor: "#66a8a6" };
                            valWords = "Received By Store";
                            break;
                          case "HANDLED_BY_STAFF":
                            style = { backgroundColor: "#008b8b" };
                            valWords = "Handled by Staff";
                            break;
                          case "REFUND_SUCCESS":
                            style = { backgroundColor: "#33ba0a" };
                            valWords = "Refund Success!";
                            break;
                          case "REFUND_REJECTED":
                            style = { backgroundColor: "#e1282d" };
                            valWords = "Refund Rejected";
                            break;
                          default:
                            style = { backgroundColor: "#33ba0a" };
                        }
                        return (
                          <Chip
                            style={{ ...style, color: "white" }}
                            label={valWords}
                          />
                        );
                      }
                    }
                  ]}
                  data={currRefund.refundLineItems}
                  options={{
                    filtering: true,
                    sorting: true,
                    pageSize: 3,
                    pageSizeOptions: [3, 5, 10],
                    actionsColumnIndex: -1,
                    headerStyle: { textAlign: "center" }, //change header padding
                    cellStyle: { textAlign: "center" }
                  }}
                />
              ) : (
                ""
              )}
            </Grid>
            <Grid item xs={12} md={2}>
              {currRefund && inputState.promoCodeName? (
                <MaterialTextField
                  fieldLabel="Promo Code Used"
                  fieldName="promoCodeName"
                  state={inputState}
                  autoFocus={true}
                  disabled={disabled}
                  onChange={onChange}
                  errors={errors}
                />
              ) : (
                ""
              )}
            </Grid>
            <Grid item xs={12} md={2}>
              {currRefund ? (
                <MaterialTextField
                  fieldLabel="Discount Amount"
                  fieldName="promoCodeDiscount"
                  state={inputState}
                  autoFocus={true}
                  disabled={disabled}
                  onChange={onChange}
                  errors={errors}
                />
              ) : (
                ""
              )}
            </Grid>
            <Grid item xs={12} md={4}></Grid>
            <Grid item xs={12} md={2}>
              <MaterialTextField
                fieldLabel="Total Quantity"
                fieldName="quantity"
                state={inputState}
                autoFocus={true}
                disabled={disabled}
                onChange={onChange}
                errors={errors}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <MaterialTextField
                fieldLabel="Total Refund Amount"
                fieldName="refundAmount"
                state={inputState}
                autoFocus={true}
                disabled={disabled}
                onChange={onChange}
                errors={errors}
              />
            </Grid>
          </Grid>
        </form>
      ) : (
        ""
      )}
    </div>
  );
};

export default withPage(ViewRefundRecordDetails);
