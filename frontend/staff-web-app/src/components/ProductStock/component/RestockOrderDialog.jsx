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
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
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
  ViewColumn,
  Visibility
} from "@material-ui/icons";
import {
  retrieveAllRestockOrder,
  createRestockOrder
} from "./../../../redux/actions/restockOrderAction";
import StockIdQuantityMap from "./../../../models/restockOrder/StockIdQuantityMap";

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

const RestockOrderDialog = ({ elements, store, open, onClose }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(elements);
  }, []);

  const data = items.map(e => {
    const orderQuantity = e.orderQuantity ? e.orderQuantity : "";
    return {
      productStockId: e.productStockId,
      productName: e.productName,
      sku: e.sku,
      quantity: e.quantity,
      image: e.image,
      status: e.status,
      orderQuantity: orderQuantity
    };
  });

  const onChange = (e, productStockId, index) => {
    const elements = [...items];
    const value = e.target.value.replace(/[^0-9]/g, "");
    elements[index].orderQuantity = Number(value);
    setItems(elements);
  };

  const handleCreateRestockOrder = () => {
    const stockIdQuantityMaps = [];
    const storeId = store.storeId;
    items.map(item => {
      const { productStockId, orderQuantity } = item;
      stockIdQuantityMaps.push(
        new StockIdQuantityMap(productStockId, orderQuantity)
      );
    });
    dispatch(createRestockOrder({ storeId, stockIdQuantityMaps }, history));
  };
  console.log(items);

  const { buildingName, line1, line2, postalCode } = store.address;

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth={"md"}>
      <DialogTitle style={{ textAlign: "center" }}>Restock Order</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography style={{ fontWeight: "bold", fontStyle: "italic" }}>
              {buildingName}
            </Typography>
            <Typography style={{ fontWeight: "bold", fontStyle: "italic" }}>
              {line1} {line2}
            </Typography>
            <Typography style={{ fontWeight: "bold", fontStyle: "italic" }}>
              {postalCode}, Singapore
            </Typography>
          </Grid>
        </Grid>
        <Divider style={{ marginTop: "5%" }} />
        <MaterialTable
          title=""
          style={{ boxShadow: "none" }}
          icons={tableIcons}
          columns={[
            { title: "Product stock ID.", field: "productStockId" },
            { title: "SKU", field: "sku" },
            { title: "Product name", field: "productName" },
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
            {
              title: "Stock status",
              field: "status",
              render: ({ status }) => {
                const style =
                  status === "NORMAL"
                    ? { backgroundColor: "#33ba0a" }
                    : { backgroundColor: "#feaa4b" };
                return (
                  <Chip
                    style={{ ...style, color: "white", width: "100%" }}
                    label={status}
                  />
                );
              }
            },
            {
              title: "Current stock",
              field: "quantity"
            },
            {
              title: "Order quantity",
              field: "orderQuantity",
              render: ({ productStockId, orderQuantity, tableData }) => {
                return (
                  <TextField
                    name="orderQuantity"
                    fullWidth
                    margin="normal"
                    value={orderQuantity}
                    onChange={e => {
                      onChange(e, productStockId, tableData.id);
                    }}
                    style={{ textAlign: "center" }}
                    inputProps={{ style: { textAlign: "center" } }}
                  />
                );
              }
            }
          ]}
          data={data}
          options={{
            paging: false,
            headerStyle: { textAlign: "center" }, //change header padding
            cellStyle: { textAlign: "center" }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button color="primary" onClick={handleCreateRestockOrder}>
          Submit restock request
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RestockOrderDialog;
