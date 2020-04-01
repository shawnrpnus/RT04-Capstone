import React, { useEffect, useState } from "react";
import withPage from "../Layout/page/withPage";
import MaterialTextField from "../../shared/components/Form/MaterialTextField";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors } from "../../redux/actions";
import { Grid } from "@material-ui/core";
import MaterialObjectSelect from "../../shared/components/Form/MaterialObjectSelect";
import {
  createInStoreRefundRequest, createInStoreRefundSuccess,
  retrieveAllRefundModeEnum,
  retrieveAllRefundStatusEnum
} from "../../redux/actions/refundAction";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Button } from "reactstrap";
import axios from "axios";
import {
  retrieveTransactionByOrderNumber,
  retrieveTransactionByOrderNumberSuccess
} from "../../redux/actions/transactionAction";
import MaterialTable from "material-table";
import {
  Add,
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
  ShoppingCart,
  ViewColumn,
  Visibility
} from "@material-ui/icons";
import store from "../../App/store";
import MaterialNumberSelect from "../../shared/components/Form/MaterialNumberSelect";
import RefundLineItemRequest from "../../models/refund/RefundLineItemRequest";
import Refund from "../../App/Router/WrappedRoutes/Refund";
import RefundRequest from "../../models/refund/RefundRequest";
import {useHistory} from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";

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

const _ = require("lodash");

const CreateEditRefundRecord = props => {
  const errors = useSelector(state => state.errors);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => dispatch(retrieveAllRefundModeEnum()), []);
  useEffect(() => dispatch(retrieveAllRefundStatusEnum()), []);

  //State
  const [inputState, setInputState] = useState({
    quantity: 0,
    refundAmt: 0,
    totalRefundAmount: 0,
    refundMode: "IN_STORE",
    refundStatus: "",
    refundLabelCode: "",
    refundDateTime: "",
    reason: "",
    transactionOrderNumber: "",
    quantityToRefund: new Array(12).fill(0),
    customerId: "",
    promoCode: 0,
    promoCodeName: ""

  });
  const allRefundStatusEnums = useSelector(
    state => state.refund.allRefundStatusEnum
  );
  const allRefundModeEnums = useSelector(
    state => state.refund.allRefundModeEnum
  );
  const currStaff = useSelector(state => state.staffEntity.loggedInStaff);
  const currTransaction = useSelector(state => state.transaction.transaction);
  // const currLength = useSelector(state => state.transaction.transaction.transactionLineItems.length);
  console.log(currTransaction);
  console.log(inputState);
  useEffect(()=> {
    dispatch(retrieveTransactionByOrderNumberSuccess())},
    []
  );
  useEffect(
    () =>
      setInputState(inputState => ({
        ...inputState,
        quantityToRefund: new Array(_.get(currTransaction, "transactionLineItems.length")).fill(0),
        refundAmt: new Array(_.get(currTransaction, "transactionLineItems.length")).fill(0),
        customerId: _.get(currTransaction, "customer.customerId"),
        promoCode: _.get(currTransaction, "promoCode") ? _.get(currTransaction, "promoCode"): 0,
        promoCodeName: _.get(currTransaction, "promoCode") ? _.get(currTransaction, "promoCode.promoCodeName"): 0,
      }))
    ,
    [currTransaction]
  );
  // console.log(allRefundModeEnums);
  console.log(inputState);
  const onChange = e => {
    e.persist();
    console.log(e);
    setInputState(inputState => ({
      ...inputState,
      [e.target.name]: e.target.value
    }));
    if (Object.keys(errors).length !== 0) {
      dispatch(clearErrors());
    }
    // console.log(inputState);
  };

  const onChangeTable = (e, index, rowData) => {
    console.log(e);
    // const temp = { ...inputState };
    // temp.quantityToRefund[index] = e.target.value;
    // setInputState(temp);

    let temp = { ...inputState };
    let arr = [...inputState.quantityToRefund];
    arr[index] = e.target.value;
    console.log(arr);
    let totalQuantity = arr.reduce((a, b) => a + b, 0);
    // let amount = inputState.refundAmt;
    // amount += (e.target.value * rowData.initialSubTotal);

    let amount = 0;
    amount = calculateTotalRefundAmount(arr);

    setInputState(inputState => ({
      ...inputState,
      quantityToRefund: arr,
      quantity: totalQuantity,
      totalRefundAmount: amount
    }));
  };
  console.log("promoCode",inputState.promoCode);

  const calculateTotalRefundAmount= (arr) => {
    console.log(arr);
    const lineItems = currTransaction.transactionLineItems;
    console.log(lineItems);
    let amt = 0;
    let temp = { ...inputState };
    let arrayAmt = [...inputState.refundAmt];
    lineItems.forEach(myFunction);
    function myFunction(item, index)
    {
      if(item.finalSubTotal) {
        amt += (item.finalSubTotal/item.quantity) * arr[index];
        arrayAmt[index] = (item.finalSubTotal/item.quantity);
      } else {
        amt += (item.initialSubTotal) * arr[index];
        arrayAmt[index] = item.initialSubTotal;
      }
      if(inputState.promoCode) {
        amt -= inputState.promoCode.flatDiscount;
        let val = 1 - inputState.promoCode.percentageDiscount;
        amt *= val;
      }

      setInputState(inputState => ({
        ...inputState,
        refundAmt: arrayAmt
      }));
      return amt;
    }
    console.log(amt);
    return amt;
  };

  const handleLoadTransactionClick = () => {
    console.log("hi");
    dispatch(
      retrieveTransactionByOrderNumber(inputState.transactionOrderNumber)
    );
  };
  const transactionProps = {
    endAdornment: (
      <InputAdornment position="end">
        <Button
          size="sm"
          color="success"
          outline
          aria-label="toggle password visibility"
          onClick={handleLoadTransactionClick}
        >
          Search
        </Button>
      </InputAdornment>
    )
  };

  const onSubmit = () => {
    const lineItems = currTransaction.transactionLineItems;
    const staffId = currStaff.staffId;
    const refundLineItems = [];
    lineItems.forEach(myFunction);
    function myFunction(item, index)
    {
      refundLineItems.push(new RefundLineItemRequest(item.transactionLineItemId, inputState.quantityToRefund[index], staffId));

      // console.log(item);
      // console.log(index);
    }
    const refundRequest = new RefundRequest(inputState.refundMode, inputState.reason, refundLineItems, inputState.customerId);
    console.log(refundRequest);
    dispatch(createInStoreRefundRequest(refundRequest, history, setInputState));
  };

  return (
    <div>
      <div>
        <h4>Create In-Store Refund</h4>
      </div>
      <form className="material-form">
        <Grid container spacing={3}>
          {/*<Grid item xs={12} md={6}>*/}
          {/*  {allRefundModeEnums ? (*/}
          {/*    <div>*/}
          {/*      <FormControl fullWidth={true}>*/}
          {/*        <InputLabel required={true}>Refund Mode</InputLabel>*/}
          {/*        <Select*/}
          {/*          name="refundMode"*/}
          {/*          value={inputState.refundMode}*/}
          {/*          onChange={onChange}*/}
          {/*          fullWidth*/}
          {/*          label="Refund Mode"*/}
          {/*        >*/}
          {/*          {allRefundModeEnums.map(function(item, index) {*/}
          {/*            return (*/}
          {/*              <MenuItem value={item} key={index}>*/}
          {/*                {item}*/}
          {/*              </MenuItem>*/}
          {/*            );*/}
          {/*          })}*/}
          {/*        </Select>*/}
          {/*      </FormControl>*/}
          {/*    </div>*/}
          {/*  ) : (*/}
          {/*    ""*/}
          {/*  )}*/}
          {/*</Grid>*/}

          <Grid item xs={12} md={12}>
            <MaterialTextField
              fieldLabel="Reason"
              fieldName="reason"
              state={inputState}
              autoFocus={true}
              errors={errors}
              onChange={onChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <MaterialTextField
              fieldLabel="Transaction Order Number"
              fieldName="transactionOrderNumber"
              state={inputState}
              errors={errors}
              onChange={onChange}
              InputProps={transactionProps}
            />
          </Grid>
          <Grid item xs={12} md={6}></Grid>

          <Grid item xs={12} md={12}>
            {currTransaction ? (
              <MaterialTable
                title="Transaction Details"
                style={{ boxShadow: "none" }}
                icons={tableIcons}
                columns={[
                  {
                    title: "Serial No.",
                    field: "productVariant.product.serialNumber"
                  },
                  {
                    title: "Product Name",
                    field: "productVariant.product.productName"
                  },
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
                          rowData.productVariant.productImages[0]
                            .productImageUrl
                        }
                      />
                    )
                  },
                  {
                    title: "Unit Price",
                    field: "initialSubTotal"
                  },
                  {
                    title: "Quantity",
                    field: "quantity"
                  },
                  {
                    title: "Price",
                    field: "finalSubTotal",
                    render: (rowData) => {
                      const finalSubTotal = rowData.finalSubTotal;
                      // console.log(finalSubTotal);
                      let valToDisplay = 0;
                      if(finalSubTotal) {
                        valToDisplay = finalSubTotal;
                      } else {
                        valToDisplay = rowData.initialSubTotal* rowData.quantity;
                      }
                      return (
                        valToDisplay
                      );
                    }
                  },
                  {
                    title: "Quantity to Refund",
                    field: "quantityToRefund[tableData.id]",
                    render: (rowData) => {

                      const tableData = rowData.tableData;
                      console.log("tableData",tableData);
                      console.log("rowData",rowData);
                      return (

                        <Select
                          name="quantityToRefund[tableData.id]"
                          value={inputState.quantityToRefund[tableData.id] || 0}
                            onChange={e => {
                              onChangeTable(e, tableData.id, rowData);}}
                          fullWidth
                          label="Refund Status"
                        >
                          {_.range(0, rowData.quantity + 1).map(function(item, index) {
                            return (
                              <MenuItem value={item} key={index}>
                                {item}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      );
                    }
                  }
                ]}
                data={currTransaction.transactionLineItems}
                options={{
                  filtering: true,
                  sorting: true,
                  pageSize: 3,
                  pageSizeOptions: [3, 5, 10],
                  actionsColumnIndex: -1,
                  headerStyle: { textAlign: "center" }, //change header padding
                  cellStyle: { textAlign: "center" }
                  // selection: true
                }}
                // actions={[
                //   warehouse
                //     ? {
                //       icon: Add,
                //       tooltip: "Simulate ordering from supplier",
                //       onClick: (event, rowData) => handleAddStock(event, rowData)
                //     }
                //     : {
                //       icon: ShoppingCart,
                //       tooltip: "Create restock order",
                //       onClick: (event, rowData) => handleAddStock(event, rowData)
                //     },
                //   {
                //     icon: FaQrcode,
                //     tooltip: "Generate QR Code(s)",
                //     onClick: (event, rowData) => generateQR(event, rowData)
                //   }
                // ]}
              />
            ) : (
              ""
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {currTransaction ? (
                <MaterialTextField
                  fieldLabel="Promo Code Used"
                  fieldName="promoCodeName"
                  state={inputState}
                  errors={errors}
                  onChange={onChange}
                  disabled={true}
                />)
              : ""}
          </Grid>
          <Grid item xs={12} md={6}>
            {currTransaction ? (
              <MaterialTextField
                fieldLabel="Total Quantity"
                fieldName="quantity"
                state={inputState}
                autoFocus={true}
                errors={errors}
                onChange={onChange}
                disabled={true}
              />)
              : "" }
          </Grid>
          <Grid item xs={12} md={6}>
            {currTransaction ? (
            <MaterialTextField
              fieldLabel="Total Refund Amount"
              fieldName="totalRefundAmount"
              state={inputState}
              errors={errors}
              onChange={onChange}
              disabled={true}
            />)
              : ""}
          </Grid>

          <Grid item xs={12} md={10}>
          </Grid>
          <Grid item xs={12} md={2}>

            <Button size="sm"
                    outline
                    onClick={onSubmit} round color="primary"
                    disabled={!currTransaction}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default withPage(CreateEditRefundRecord);
