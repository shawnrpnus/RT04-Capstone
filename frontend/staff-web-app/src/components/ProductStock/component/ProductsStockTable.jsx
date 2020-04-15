import React, { useState, useEffect } from "react";
import { Link, withRouter, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
  Visibility,
  ShoppingCart
} from "@material-ui/icons";
import MaterialTable from "material-table";
import Chip from "@material-ui/core/Chip";

import withPage from "../../Layout/page/withPage";
import {
  retrieveProductStocksByParameter,
  simulateReorderingFromSupplier
} from "../../../redux/actions/productStockActions";
import RestockOrderDialog from "./RestockOrderDialog";
import { FaQrcode } from "react-icons/fa";

const _ = require("lodash");
const jsog = require("jsog");

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

const ProductsStockTable = props => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [selectedProductStocks, setSelectedProductStocks] = useState([]);
  const [open, setOpen] = useState(false);

  const productStocks = useSelector(
    state => state.productStock.allProductStock
  );

  const { renderLoader, store, staff } = props;
  const warehouse =
    _.get(staff, "department.departmentName", "") === "Warehouse";

  useEffect(() => {
    if (warehouse) {
      dispatch(retrieveProductStocksByParameter());
    } else if (_.get(store, "storeId", false)) {
      dispatch(retrieveProductStocksByParameter(store.storeId));
    }
  }, [_.isEqual(productStocks)]);

  const handleAddStock = (evt, data) => {
    evt.preventDefault();
    if (warehouse) {
      let productStockIds = [];
      data.forEach(element => {
        productStockIds.push(element.productStockId);
      });
      dispatch(simulateReorderingFromSupplier(productStockIds, history));
    } else {
      setSelectedProductStocks([...data]);
      setOpen(true);
    }
  };

  const generateQR = (event, rowData) => {
    event.preventDefault();
    const productStockIds = rowData.map(row => row.productStockId);
    const productStocksToGenerateQR = productStocks.filter(productStock =>
      productStockIds.includes(productStock.productStockId)
    );
    localStorage.setItem(
      "productStocks",
      jsog.stringify(productStocksToGenerateQR)
    );
    window.open(`${process.env.PUBLIC_URL}/qrCodes`);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  let data = [];
  if (productStocks) {
    data = productStocks.map(productStock => {
      const {
        productStockId,
        productVariant,
        quantity,
        notificationLevel
      } = productStock;
      const status = notificationLevel >= quantity ? "LOW STOCK" : "NORMAL";
      return {
        productStockId: productStockId,
        productName: _.get(productVariant, "product.productName", ""),
        sku: _.get(productVariant, "sku", ""),
        quantity: quantity,
        image: _.get(productVariant, "productImages[0].productImageUrl", ""),
        status: status
      };
    });
  }

  return (
    <React.Fragment>
      <div className="table" style={{ verticalAlign: "middle" }}>
        {productStocks ? (
          <MaterialTable
            title="Product Stocks"
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
              { title: "Current stock", field: "quantity" },
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
              }
            ]}
            data={data}
            options={{
              filtering: true,
              sorting: true,
              pageSize: 20,
              pageSizeOptions: [20, 50, 100],
              actionsColumnIndex: -1,
              headerStyle: { textAlign: "center" }, //change header padding
              cellStyle: { textAlign: "center" },
              selection: true,
              draggable: false
            }}
            actions={[
              warehouse
                ? {
                    icon: Add,
                    tooltip: "Simulate ordering from supplier",
                    onClick: (event, rowData) => handleAddStock(event, rowData)
                  }
                : {
                    icon: ShoppingCart,
                    tooltip: "Create restock order",
                    onClick: (event, rowData) => handleAddStock(event, rowData)
                  },
              {
                icon: FaQrcode,
                tooltip: "Generate QR Code(s)",
                onClick: (event, rowData) => generateQR(event, rowData)
              }
            ]}
          />
        ) : (
          renderLoader()
        )}
      </div>
      {open && (
        <RestockOrderDialog
          open={open}
          onClose={handleCloseDialog}
          elements={selectedProductStocks}
          store={store}
        />
      )}
    </React.Fragment>
  );
};

export default withPage(ProductsStockTable, "Product Stock Management");
