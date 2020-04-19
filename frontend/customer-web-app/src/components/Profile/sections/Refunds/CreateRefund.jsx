import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {updatedViewedTransaction} from "../../../../redux/actions/transactionActions";
import {clearErrors} from "../../../../redux/actions";
import {createOnlineRefundRequest} from "../../../../redux/actions/refundAction";
import RefundLineItemRequest from "../../../../models/refund/RefundLineItemRequest";
import RefundRequest from "../../../../models/refund/RefundRequest";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import {Close, Face, ShortText} from "@material-ui/icons";
import DialogContent from "@material-ui/core/DialogContent";
import makeStyles from "@material-ui/core/styles/makeStyles";
import style from "assets/jss/material-kit-pro-react/views/componentsSections/javascriptStyles.js";
import Transition from "react-transition-group/Transition";
import GridContainer from "../../../Layout/components/Grid/GridContainer";
import {Button} from "components/UI/CustomButtons/Button";
import CreateRefundTable from "./CreateRefundTable";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import {useSnackbar} from "notistack";
import InputAdornment from "@material-ui/core/InputAdornment";
import CustomTextField from "../../../UI/CustomInput/CustomTextField";

const _ = require("lodash");
const useStyles = makeStyles(style);

const CreateRefund = ({
                        largeModal: [largeModal, setLargeModal],
                        transactionId: transactionId,
                        totalForEachItem: totalForEachItem
                      }) => {
  const errors = useSelector((state) => state.errors);
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  // const [largeModal, setLargeModal] = React.useState(false);

  //State
  const [inputState, setInputState] = useState({
    quantity: 0,
    refundAmt: new Array(100).fill(0),
    totalRefundAmount: 0,
    refundMode: "ONLINE",
    refundStatus: "",
    refundLabelCode: "",
    refundDateTime: "",
    reason: "",
    transactionOrderNumber: "",
    quantityToRefund: new Array(100).fill(0),
    customerId: "",
    promoCode: "-",
    promoCodeName: "",
    promoCodeClaimed: false,
    beforePromoCode: 0
  });
  useEffect(() => {
    dispatch(updatedViewedTransaction());
  }, []);
  const currTransaction = useSelector(
    (state) => state.transaction.viewedTransaction
  );
  const currCustomer = useSelector((state) => state.customer.loggedInCustomer);
  const {enqueueSnackbar, closeSnackbar} = useSnackbar();

  const hasBeenRefunded = (currTransaction) => {
    for(let i = 0; i < _.get(currTransaction, "transactionLineItems.length"); i++) {
      if(currTransaction.transactionLineItems[i].refundLineItems.length > 0) {
        return true;
      }
    }
  };

  useEffect(
    () =>
      setInputState((inputState) => ({
        ...inputState,
        quantityToRefund: _.get(currTransaction, "transactionLineItems.length")
          ? new Array(
            _.get(currTransaction, "transactionLineItems.length")
          ).fill(0)
          : new Array(100).fill(0),

        refundAmt: _.get(currTransaction, "transactionLineItems.length")
          ? new Array(
            _.get(currTransaction, "transactionLineItems.length")
          ).fill(0)
          : new Array(100).fill(0),

        customerId: _.get(currTransaction, "customer.customerId"),
        promoCode: _.get(currTransaction, "promoCode")
          ? _.get(currTransaction, "promoCode")
          : 0,
        promoCodeName:
          _.get(currTransaction, "promoCode")
            ? _.get(currTransaction, "promoCode.promoCodeName")
            : "-",
        promoCodeClaimed: false
        // promoCodeClaimed: hasBeenRefunded(currTransaction)
        //   && _.get(currTransaction, "promoCode") && _.get(currTransaction, "promoCode.flatDiscount")
      })),
    [currTransaction]
  );
  const onChange = (e) => {
    e.persist();
    setInputState((inputState) => ({
      ...inputState,
      [e.target.name]: e.target.value,
    }));
    if (Object.keys(errors).length !== 0) {
      dispatch(clearErrors());
    }
  };

  const closeModal = () => {
    setInputState(() => ({
      quantity: 0,
      refundAmt: new Array(100).fill(0),
      totalRefundAmount: 0,
      refundMode: "ONLINE",
      refundStatus: "",
      refundLabelCode: "",
      refundDateTime: "",
      reason: "",
      transactionOrderNumber: "",
      quantityToRefund: new Array(100).fill(0),
      customerId: "",
      promoCode: "-",
      promoCodeName: "",
      beforePromoCode: 0
    }));
    dispatch(updatedViewedTransaction());
    setLargeModal(false);
  };

  const onSubmit = () => {
    const lineItems = currTransaction.transactionLineItems;
    const staffId = null;
    const storeId = null;
    const refundLineItems = [];
    lineItems.forEach(myFunction);

    function myFunction(item, index) {
      refundLineItems.push(
        new RefundLineItemRequest(
          item.transactionLineItemId,
          inputState.quantityToRefund[index],
          staffId
        )
      );
    }

    const refundRequest = new RefundRequest(
      inputState.refundMode,
      inputState.reason,
      refundLineItems,
      inputState.customerId,
      storeId
    );
    // console.log(refundRequest);
    const name = currCustomer.firstName + " " + currCustomer.lastName;
    const orderNumber = currTransaction.orderNumber;
    // console.log("NAMEEEEE",name);
    let deliveryAddress = JSON.stringify(currTransaction.billingAddress);
    if (currTransaction.collectionMode === "DELIVERY") {
      deliveryAddress = JSON.stringify(currTransaction.deliveryAddress);
    }
    // console.log(orderNumber);
    // console.log(deliveryAddress);
    dispatch(
      createOnlineRefundRequest(
        refundRequest,
        history,
        enqueueSnackbar,
        deliveryAddress,
        name,
        orderNumber
      )
    );
  };
  // console.log("totalForEachItem CREATE REFUND", totalForEachItem);

  return (
    <React.Fragment>
      <div>
        <Dialog
          classes={{
            root: classes.modalRoot,
            paper: classes.modal + " " + classes.modalLarge,
          }}
          open={largeModal}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => closeModal()}
          aria-labelledby="large-modal-slide-title"
          aria-describedby="large-modal-slide-description"
        >
          <DialogTitle
            id="large-modal-slide-title"
            disableTypography
            className={classes.modalHeader}
          >
            <Button
              simple
              className={classes.modalCloseButton}
              key="close"
              aria-label="Close"
              onClick={() => closeModal()}
            >
              {" "}
              <Close className={classes.modalClose}/>
            </Button>
            <h3 className={classes.modalTitle}>
              <b>Create New Refund</b>
            </h3>
          </DialogTitle>
          <DialogContent
            id="large-modal-slide-description"
            className={classes.modalBody}
          >
            <CreateRefundTable
              largeModal={[largeModal, setLargeModal]}
              currTransaction={currTransaction}
              inputState={[inputState, setInputState]}
              totalForEachItem={totalForEachItem}
            />
            {currTransaction ? (
              <GridContainer>
                <Grid item md={6}>

                </Grid>
                <Grid item md={2}></Grid>
                <Grid container md={3} alignItems="flex-start" justify="flex-end">
                  <h5>
                    Subtotal: <b>${inputState.beforePromoCode.toFixed(2)}</b>
                  </h5>
                </Grid>
                <Grid item md={1}>
                </Grid>
                {inputState.promoCode
                ?
                  (
                  <React.Fragment>
                    <Grid item md={6} style={{paddingLeft: "40px"}}>
                      <h5>
                        Promo Code Used:
                        <b> {inputState.promoCodeName}</b>
                        &nbsp;
                        {
                          inputState.promoCodeClaimed
                            ? <b>(CLAIMED)</b>
                            :
                            ""
                        }
                      </h5>
                    </Grid>
                    <Grid container md={5} alignItems="flex-start" justify="flex-end">
                      <h5>
                        - <b>(${(inputState.beforePromoCode.toFixed(2) - inputState.totalRefundAmount.toFixed(2)).toFixed(2)})</b>
                      </h5>
                    </Grid>
                    <Grid item md={1} />
                  </React.Fragment>
                )
                  :""
                }

                <Grid item md={4} style={{paddingLeft: "40px"}}>
                  <h5>
                    Refund Quantity: <b>{inputState.quantity}</b>
                  </h5>
                </Grid>
                <Grid container md={7} alignItems="flex-start" justify="flex-end">
                  <h5>
                    Total Refund Amount:
                    {inputState.totalRefundAmount ? (
                      <b>${inputState.totalRefundAmount.toFixed(2)}</b>
                    ) : (
                      <b>$0.00</b>
                    )}
                  </h5>
                </Grid>
                <Grid item md={1}/>
                <Grid item md={11} style={{paddingLeft: "40px"}}>
                  <CustomTextField
                    fieldLabel="Reason"
                    fieldName="reason"
                    inputState={inputState}
                    onChange={onChange}
                    errors={errors}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          className={classes.inputAdornment}
                        >
                          <ShortText className={classes.inputAdornmentIcon}/>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item md={8}></Grid>
                <Grid item md={4}>
                  <CardActions>
                    <Button
                      fullWidth
                      color="success"
                      onClick={onSubmit}
                      style={{
                        margin: "5% 2%",
                        fontSize: "20px",
                      }}
                      disabled={inputState.quantity === 0}
                    >
                      SUBMIT REFUND
                    </Button>
                  </CardActions>
                </Grid>
              </GridContainer>
            ) : (
              ""
            )}
          </DialogContent>
        </Dialog>
      </div>
    </React.Fragment>
  );
};

export default CreateRefund;
