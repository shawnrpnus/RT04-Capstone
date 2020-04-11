import makeStyles from "@material-ui/core/styles/makeStyles";

import React, {useEffect, useState} from "react";
import shoppingCartStyle from "../../../../assets/jss/material-kit-pro-react/views/shoppingCartStyle";
import classNames from "classnames";
import Card from "../../../UI/Card/Card";
import CardBody from "../../../UI/Card/CardBody";
import Grid from "@material-ui/core/Grid";
import GridContainer from "../../../Layout/components/Grid/GridContainer";
import GridItem from "../../../Layout/components/Grid/GridItem";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import CancelIcon from "@material-ui/icons/Cancel";
import colourList from "../../../../assets/colours";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import {retrieveRefundsByTransactionId} from "../../../../redux/actions/refundAction";

const _ = require("lodash");

const jsonColorHexList = _.keyBy(colourList, "hex");
const useStyles = makeStyles(shoppingCartStyle);

function CreateRefundTable({
  largeModal: [largeModal, setLargeModal],
  currTransaction: currTransaction,
  inputState: [inputState, setInputState],
 totalForEachItem: totalForEachItem
}) {
  const classes = useStyles();

  const onChangeTable = (e, index, rowData) => {
    // const temp = { ...inputState };
    // temp.quantityToRefund[index] = e.target.value;
    // setInputState(temp);

    let temp = { ...inputState };
    let arr = [...inputState.quantityToRefund];
    arr[index] = e.target.value;
    let totalQuantity = arr.reduce((a, b) => a + b, 0);
    // let amount = inputState.refundAmt;
    // amount += (e.target.value * rowData.initialSubTotal);

    let amount = 0;
    amount = calculateTotalRefundAmount(arr);

    setInputState((inputState) => ({
      ...inputState,
      quantityToRefund: arr,
      quantity: totalQuantity,
      totalRefundAmount: amount,
    }));
  };

  const calculateTotalRefundAmount = (arr) => {
    const lineItems = currTransaction.transactionLineItems;
    let amt = 0;
    let temp = { ...inputState };
    let arrayAmt = [...inputState.refundAmt];
    lineItems.forEach(myFunction);
    function myFunction(item, index) {
      if (item.finalSubTotal) {
        amt += (item.finalSubTotal / item.quantity) * arr[index];
        arrayAmt[index] = item.finalSubTotal / item.quantity;
      } else {
        amt += (item.initialSubTotal / item.quantity) * arr[index];
        arrayAmt[index] = item.initialSubTotal / item.quantity;
      }
      if (inputState.promoCode) {
        amt -= inputState.promoCode.flatDiscount;
        let val = 1 - inputState.promoCode.percentageDiscount / 100.0;
        amt *= val;
      }

      setInputState((inputState) => ({
        ...inputState,
        refundAmt: arrayAmt,
      }));
      return amt;
    }
    if (amt < 0) {
      amt = 0;
    }
    return amt;
  };

  // console.log("currTransaction",currTransaction);
  // console.log(totalForEachItem);
  return (
    <div className={classNames(classes.main)}>
      <div className={classes.container}>
        <Card plain>
          {currTransaction ? (
            <CardBody plain>
              <h3 className={classes.cardTitle}>Refund Details</h3>
              <Grid container spacing={3}>
                <Grid item md={12}>
                  {currTransaction.transactionLineItems.map(
                    (lineItem, index) => {
                      const {
                        productImages,
                        product,
                        sizeDetails,
                        colour,
                        productVariantId,
                      } = lineItem.productVariant;
                      const { productName, discountedPrice, price } = product;
                      const {
                        quantity,
                        initialSubTotal,
                        finalSubTotal,
                      } = lineItem;
                      const afterDiscount = finalSubTotal / quantity;
                      const beforeDiscount = initialSubTotal / quantity;
                      if(!totalForEachItem) {
                        totalForEachItem = new Array(index).fill(0);
                      }
                      console.log(lineItem);
                      console.log(index);
                      console.log(totalForEachItem[index]);
                      if(!totalForEachItem[index]) {
                        totalForEachItem[index] = 0;
                      }
                      const quantityToRefund = quantity + 1 - totalForEachItem[index];
                      // const quantityToRefund = quantity +1;

                      return (
                        <div key={index}>
                          <Card plain>
                            <GridContainer
                              alignItems="center"
                              style={{ textAlign: "center" }}
                            >
                              {/* Photo */}
                              <Grid item md={2}>
                                {/* Modified CSS */}
                                <div className={classes.imgContainer}>
                                  <img
                                    className={classes.img}
                                    src={productImages[1].productImageUrl}
                                  />
                                </div>
                              </Grid>
                              {/* Name */}
                              <GridItem
                                container
                                md={5}
                                style={{ textAlign: "left" }}
                              >
                                <GridItem md={12}>
                                  <h3 className={classes.productName}>
                                    {productName}
                                  </h3>
                                </GridItem>
                                <GridItem md={12}>
                                  <h3 style={{ marginTop: "10px" }}>
                                    {finalSubTotal && (
                                      <span>${afterDiscount.toFixed(2)}</span>
                                    )}
                                    <span
                                      className={
                                        finalSubTotal && classes.discountedPrice
                                      }
                                    >
                                      ${beforeDiscount.toFixed(2)}
                                    </span>
                                  </h3>
                                </GridItem>
                                <GridItem md={12}>
                                  {jsonColorHexList[colour].name},{" "}
                                  {sizeDetails.productSize}
                                </GridItem>
                              </GridItem>
                              {/* Quantity */}
                              <GridItem
                                xs={4}
                                md={1}
                                // style={{ textAlign: "right" }}
                              >
                                <Select
                                  name="quantityToRefund[index]"
                                  value={
                                    inputState.quantityToRefund[index] || 0
                                  }
                                  onChange={(e) => {
                                    onChangeTable(e, index, lineItem);
                                  }}
                                  fullWidth
                                  label="Refund Status"
                                >
                                  {_.range(0, quantityToRefund).map(function(
                                    item,
                                    index
                                  ) {
                                    return (
                                      <MenuItem value={item} key={index}>
                                        {item}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </GridItem>
                              {/*Amount*/}
                              <GridItem md={2}>
                                <h3>
                                  $
                                  {inputState.refundAmt[index].toFixed(2) *
                                    inputState.quantityToRefund[index]}
                                </h3>
                              </GridItem>
                              {/* Action */}
                              <GridItem md={1}>
                                <IconButton className={classes.buttonTopMargin}>
                                  <CancelIcon style={{ color: "red" }} />
                                </IconButton>
                              </GridItem>
                            </GridContainer>
                          </Card>
                          <Divider style={{ margin: "0 5%" }} />
                        </div>
                      );
                    }
                  )}
                </Grid>
              </Grid>
            </CardBody>
          ) : (
            ""
          )}
        </Card>
      </div>
    </div>
  );
}

export default CreateRefundTable;
