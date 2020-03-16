import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useConfirm } from "material-ui-confirm";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import { Add } from "@material-ui/icons";

import { ProductsTableRaw } from "./../../Product/ProductsList/components/ProductsTable";
import { retrieveProductsDetails } from "./../../../redux/actions/productActions";
import { updateProductsToInstagramPostAssociation } from "./../../../redux/actions/instagramActions";

const _ = require("lodash");

const ProductTableDialog = ({
  open,
  onClose,
  postId: instagramPostId,
  renderLoader
}) => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.product.products);
  const confirmDialog = useConfirm();

  useEffect(() => {
    dispatch(retrieveProductsDetails());
  }, []);

  const handleAssociateProductToInstagramPost = data => {
    const productIds = data.map(e => e.productId);
    confirmDialog({
      description: "Associating product(s) to Instagram post..."
    })
      .then(() =>
        dispatch(
          updateProductsToInstagramPostAssociation(
            { instagramPostId, productIds },
            onClose
          )
        )
      )
      .catch(() => null);
  };

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth={"lg"}>
      <DialogTitle>Product Table</DialogTitle>
      <DialogContent>
        <ProductsTableRaw
          products={products}
          selectable={true}
          selectionAction={{
            tooltip: "Associate product to Instagram post",
            icon: Add,
            onClick: (evt, data) => handleAssociateProductToInstagramPost(data)
          }}
          retrieveProductsDetails={retrieveProductsDetails}
          renderLoader={renderLoader}
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductTableDialog;
