import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useConfirm } from "material-ui-confirm";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
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
  ViewColumn,
  Delete,
  FiberManualRecord
} from "@material-ui/icons";
import MaterialTable from "material-table";
import { updateProductsToInstagramPostAssociation } from "./../../../redux/actions/instagramActions";
import colourList from "../../../scss/colours.json";

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
const jsonColorNameList = _.keyBy(colourList, "name");
const jsonColorHexList = _.keyBy(colourList, "hex");

const ViewAssociatedProductDialog = ({
  open,
  onClose,
  postId: instagramPostId,
  associatedProducts
}) => {
  const dispatch = useDispatch();
  const confirmDialog = useConfirm();

  let data = [];
  if (associatedProducts.length > 0) {
    data = associatedProducts.map(
      ({ productId, serialNumber, productName, category, productVariants }) => {
        let colours = productVariants.map(e => jsonColorHexList[e.colour].name);
        colours = _.uniq(colours);
        return {
          productId,
          serialNumber,
          productName,
          category: _.get(category, "categoryName", ""),
          image: _.get(
            productVariants,
            "[0].productImages[0].productImageUrl",
            ""
          ),
          colours
        };
      }
    );
  }

  const handleDeleteProductsFromInstagramPost = data => {
    const fullList = associatedProducts.map(e => e.productId);
    const removeIds = data.map(e => e.productId);
    const productIds = fullList.filter(id => {
      return !removeIds.includes(id);
    });
    confirmDialog({
      description: "Removing product(s) association from Instagram post..."
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
      <DialogContent>
        <MaterialTable
          title="Associated products"
          style={{ boxShadow: "none" }}
          icons={tableIcons}
          onChangePage={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          columns={[
            {
              title: "Product ID",
              field: "productId"
            },
            { title: "Serial number", field: "serialNumber" },
            {
              title: "Image",
              field: "image",
              render: rowData => (
                <img
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "10%"
                  }}
                  src={rowData.image}
                />
              )
            },
            {
              title: "Product name",
              field: "productName"
            },
            {
              title: "Category",
              field: "category"
            },

            {
              title: "Colours",
              field: "colours",
              render: rowData =>
                rowData.colours.map((color, index) => {
                  return (
                    <FiberManualRecord
                      key={color + index}
                      style={{
                        color: jsonColorNameList[color].hex,
                        border: color === "White" ? "1px black solid" : null,
                        borderRadius: "200px",
                        transform: color === "White" ? "scale(0.7)" : false
                      }}
                    />
                  );
                })
            }
          ]}
          data={data}
          options={{
            filtering: true,
            sorting: true,
            pageSize: 10,
            pageSizeOptions: [10, 20, 40],
            actionsColumnIndex: -1,
            headerStyle: { textAlign: "center" }, //change header padding
            cellStyle: { textAlign: "center" },
            draggable: false,
            selection: true
          }}
          actions={[
            {
              icon: Delete,
              tooltip: "Delete product(s) from Instagram post",
              onClick: (e, rowData) => {
                handleDeleteProductsFromInstagramPost(rowData);
              }
            }
          ]}
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewAssociatedProductDialog;
