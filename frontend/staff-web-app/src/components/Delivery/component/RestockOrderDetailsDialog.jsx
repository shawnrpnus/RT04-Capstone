import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import InputLabel from "@material-ui/core/InputLabel";
import MaterialTable from "material-table";
import { useConfirm } from "material-ui-confirm";
import dateformat from "dateformat";
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
  ViewColumn
} from "@material-ui/icons";
import { confirmRestockOrderDelivery } from "../../../redux/actions/deliveryActions";
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

const RestockOrderDetailsDialog = ({ elements, open, onClose }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const confirmDialog = useConfirm();
  const [itemsByStore, setItemsByStore] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("all");

  useEffect(() => {
    const stores = elements.map(e => _.get(e, "productStock.store.storeName"));
    setStores(_.uniq(stores));
    setItemsByStore(elements);
  }, []);

  const data = itemsByStore.map(item => {
    let {
      inStoreRestockOrderItemId,
      deliveryDateTime,
      itemDeliveryStatus,
      quantity,
      productStock
    } = item;
    let date = deliveryDateTime;
    if (deliveryDateTime)
      date = dateformat(new Date(deliveryDateTime), "dd'-'mmm'-'yyyy");
    return {
      inStoreRestockOrderItemId: inStoreRestockOrderItemId,
      deliveryDateTime: date,
      itemDeliveryStatus: itemDeliveryStatus.split("_").join(" "),
      quantity: quantity,
      productName: _.get(productStock, "productVariant.product.productName"),
      image: _.get(
        productStock,
        "productVariant.productImages[0].productImageUrl"
      ),
      store: _.get(productStock, "store"),
      storeName: _.get(productStock, "store.storeName")
    };
  });

  const onSelectStore = ({ target: input }) => {
    const { value } = input;
    if (value === "all") {
      setItemsByStore(elements);
      setSelectedStore(value);
    } else {
      setItemsByStore(
        elements.filter(
          item => _.get(item, "productStock.store.storeName") === input.value
        )
      );
      setSelectedStore(value);
    }
  };

  const handleConfirmDelivery = data => {
    const inStoreRestockOrderItemIds = data.map(
      e => e.inStoreRestockOrderItemId
    );
    confirmDialog({
      description: "The selected products will be marked as delivered"
    })
      .then(() => {
        dispatch(confirmRestockOrderDelivery({ inStoreRestockOrderItemIds }));
        onClose();
      })
      .catch(() => null);
  };

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth={"md"}>
      <DialogTitle style={{ textAlign: "center" }}>Order details</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={false} md={10} />
          <Grid item xs={12} md={2}>
            <InputLabel>Select store: </InputLabel>
            <Select fullWidth defaultValue={"all"} onChange={onSelectStore}>
              <MenuItem key={"all"} value={"all"}>
                All
              </MenuItem>
              {stores.map(store => {
                return (
                  <MenuItem key={store} value={store}>
                    {store}
                  </MenuItem>
                );
              })}
            </Select>
          </Grid>
        </Grid>
        <Divider style={{ marginTop: "5%" }} />
        <MaterialTable
          title=""
          style={{ boxShadow: "none" }}
          icons={tableIcons}
          columns={[
            { title: "Item ID.", field: "inStoreRestockOrderItemId" },
            {
              title: "Image",
              field: "image",
              render: rowData => (
                <img
                  style={{
                    width: "50%",
                    borderRadius: "10%"
                  }}
                  src={rowData.image}
                />
              )
            },
            { title: "Product name", field: "productName" },
            { title: "Delivery Date", field: "deliveryDateTime" },
            {
              title: "Delivery status",
              field: "itemDeliveryStatus",
              render: ({ itemDeliveryStatus }) => {
                const style = getDeliveryStatusColour(itemDeliveryStatus);
                return (
                  <Chip
                    style={{ ...style, color: "white", width: "100%" }}
                    label={itemDeliveryStatus}
                  />
                );
              }
            },
            {
              title: "Quantity",
              field: "quantity"
            },
            {
              title: "Store name",
              field: "storeName"
            }
          ]}
          data={data}
          options={{
            paging: false,
            headerStyle: { textAlign: "center" }, //change header padding
            cellStyle: { textAlign: "center" },
            draggable: false
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose} color="secondary">
          Close
        </Button>
        <Button
          color="primary"
          onClick={() => handleConfirmDelivery(itemsByStore)}
          disabled={
            itemsByStore.length === 0 ||
            itemsByStore[0].itemDeliveryStatus === "DELIVERED" ||
            selectedStore === "all"
          }
        >
          Confirm delivery
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RestockOrderDetailsDialog;
