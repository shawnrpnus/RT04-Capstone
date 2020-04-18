import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Grid from "@material-ui/core/Grid";
import { useConfirm } from "material-ui-confirm";

import {
  retrieveAllDiscount,
  addDiscountToProducts,
  removeDiscountFromProducts,
} from "../../../redux/actions/discountActions";
import { retrieveProductsDetails } from "../../../redux/actions/productActions";

import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import { Add, Delete } from "@material-ui/icons";

import withPage from "../../Layout/page/withPage";
import { ProductsTableRaw } from "../../Product/ProductsList/components/ProductsTable";
import ButtonGroup from "@material-ui/core/ButtonGroup";

const _ = require("lodash");
const moment = require("moment");

const DiscountAssociationTable = (props) => {
  const dispatch = useDispatch();
  const confirmDialog = useConfirm();
  const discounts = useSelector((state) => state.discount.discounts);
  const products = useSelector((state) => state.product.products);

  const [discount, setDiscount] = useState("");
  const [addMode, setAddMode] = useState(true);
  const { discountId: selectedDiscountId } = discount;

  console.log(selectedDiscountId);
  useEffect(() => {
    dispatch(retrieveProductsDetails());
    dispatch(retrieveAllDiscount());
  }, []);

  const onChange = (e) => {
    setDiscount(e.target.value);
  };

  const handleAddDiscountToProducts = (data) => {
    const productIds = data.map((e) => e.productId);
    dispatch(
      addDiscountToProducts({ discountId: selectedDiscountId, productIds })
    );
  };

  const handleRemoveDiscountFromProducts = (data) => {
    const productIds = data.map((e) => e.productId);
    confirmDialog({
      description: "Discount will be removed for the selected product(s).",
    })
      .then(() =>
        dispatch(
          removeDiscountFromProducts({
            discountId: selectedDiscountId,
            productIds,
          })
        )
      )
      .catch(() => null);
  };

  const { renderLoader } = props;
  const salesmarketing =
    _.get(props, "staff.department.departmentName") === "Sales and Marketing";

  return (
    <>
      <div className="card__title">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {salesmarketing && (
              <>
                {addMode ? (
                  <h5 className="bold-text">Add discount to product(s)</h5>
                ) : (
                  <h5 className="bold-text">Remove discount from product(s)</h5>
                )}
              </>
            )}
          </Grid>
          <Grid item xs={12} md={3} />
          <Grid item xs={12} md={3}>
            {salesmarketing && (
              <ButtonGroup color="primary">
                <Button
                  onClick={() => setAddMode(true)}
                  variant={addMode ? "contained" : "outlined"}
                >
                  Add
                </Button>
                <Button
                  onClick={() => setAddMode(false)}
                  variant={addMode ? "outlined" : "contained"}
                >
                  View/Delete
                </Button>
              </ButtonGroup>
            )}
          </Grid>
        </Grid>
      </div>
      <form className="material-form">
        <Grid container spacing={3}>
          <Grid item xs={12} md={2}>
            {discounts && (
              <>
                <InputLabel>Select discount: </InputLabel>
                <Select
                  name="discount"
                  className="material-form__field"
                  onChange={onChange}
                  value={discount}
                >
                  {discounts.map((discount, index) => (
                    <MenuItem key={index} value={discount}>
                      {discount.discountName}
                    </MenuItem>
                  ))}
                </Select>
              </>
            )}
          </Grid>
          {addMode && salesmarketing ? (
            <Grid item xs={12}>
              {products ? (
                <ProductsTableRaw
                  selectable={true}
                  products={products.filter(
                    (p) =>
                      p.product.discounts.filter((e) => {
                        // filter out the one that clash OR match
                        const { discountId } = e;
                        const fromDateTime = moment(e.fromDateTime);
                        const toDateTime = moment(e.toDateTime);
                        const selectedFrom = moment(
                          new Date(discount.fromDateTime)
                        );
                        const selectedTo = moment(
                          new Date(discount.toDateTime)
                        );
                        // return true is clash OR match or flatDiscount > price
                        return (
                          // (selectedFrom.isSameOrBefore(toDateTime) &&
                          //   selectedTo.isSameOrAfter(fromDateTime))
                          (discount.toDateTime &&
                            !(
                              // negate of pass === clash
                              (
                                selectedFrom.isAfter(toDateTime) ||
                                selectedTo.isBefore(fromDateTime)
                              )
                            )) ||
                          discountId === selectedDiscountId
                        );
                      }).length === 0 && // no discount
                      // if clash OR match => to make it false (length !== 0) to remove from the list of products
                      p.product.price > discount.flatDiscount // price > flatDiscount
                  )}
                  selectionAction={{
                    tooltip: selectedDiscountId
                      ? "Add discount to product(s)"
                      : "Select a discount to add discount to product(s)",
                    icon: Add,
                    onClick: (evt, data) => handleAddDiscountToProducts(data),
                    disabled: !selectedDiscountId,
                  }}
                  retrieveProductsDetails={retrieveProductsDetails}
                />
              ) : (
                renderLoader()
              )}
            </Grid>
          ) : (
            <Grid item xs={12}>
              {products ? (
                <ProductsTableRaw
                  selectable={salesmarketing ? true : false}
                  products={products.filter(
                    (p) =>
                      p.product.discounts.filter(
                        (discount) => discount.discountId === selectedDiscountId
                      ).length !== 0
                  )}
                  selectionAction={
                    salesmarketing
                      ? {
                          tooltip: "Remove discount from product(s)",
                          icon: Delete,
                          onClick: (evt, data) =>
                            handleRemoveDiscountFromProducts(data),
                        }
                      : true
                  }
                  retrieveProductsDetails={retrieveProductsDetails}
                />
              ) : (
                renderLoader()
              )}
            </Grid>
          )}
        </Grid>
      </form>
    </>
  );
};

export default withPage(DiscountAssociationTable, "Discount Association");
