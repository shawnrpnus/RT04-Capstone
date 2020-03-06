import React, { PureComponent } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
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
import MaterialTable from "material-table";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import withPage from "../../Layout/page/withPage";
import ProductsStockDetails from "./ProductsStockDetails";
import {
  retrieveProductStocksByParameter,
  simulateReorderingFromSupplier
} from "../../../redux/actions/productStockActions";
import Checkbox from "@material-ui/core/Checkbox";
import AddTagToProductsRequest from "../../../models/tag/AddTagToProductsRequest";
import { Typography } from "@material-ui/core";

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

// const jsonColorNameList = _.keyBy(colourList, "name");
// const jsonColorHexList = _.keyBy(colourList, "hex");

class ProductsStockTable extends PureComponent {
  state = {
    // redirect: false,
    selectedProductStocks: [],
    selectedProductId: ""
  };

  componentDidMount() {
    const warehouse =
      _.get(this.props, "staff.department.departmentName") === "Warehouse";
    const store = this.props.store;
    if (warehouse) {
      this.props.retrieveProductStocksByParameter();
    } else if (store.storeId) {
      this.props.retrieveProductStocksByParameter(store.storeId);
    }
  }

  handleCheckBox = (evt, data) => {
    evt.preventDefault();
    // data is the list of products selected
    // console.log(evt);
    // console.log(data);
    let productStockIds = [];
    data.forEach(element => {
      productStockIds.push(element.productStockId);
    });
    // console.log(productStockIds);
    this.props.simulateReorderingFromSupplier(
      productStockIds,
      this.props.history
    );
    // const req = new AddTagToProductsRequest(this.state.tagId, productStockIds);
    // this.props.addTagToProducts(req, this.props.history);
  };

  render() {
    const { renderLoader, productStocks, store } = this.props;

    let data = [];
    if (productStocks) {
      data = productStocks.map(productStock => {
        return {
          productStockId: productStock.productStockId,
          productName: productStock.productVariant.product.productName,
          sku: productStock.productVariant.sku,
          quantity: productStock.quantity,
          image: _.get(
            productStock,
            "productVariant.productImages[0].productImageUrl",
            ""
          )
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
                    // <Link
                    //   to={`/product/viewProductDetails/${rowData.productId}`}
                    // >
                    <img
                      style={{
                        width: "50%",
                        borderRadius: "10%"
                      }}
                      src={rowData.image}
                    />
                    // </Link>
                  )
                },
                { title: "Current stock", field: "quantity" }
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
                selection: true
              }}
              // selectionAction={{
              //   tooltip: "Add Tag To Products",
              //   icon: Add,
              //   onClick: (evt, data) =>
              //     this.handleAddTagToProducts(evt, data)
              // }}
              actions={[
                {
                  icon: Checkbox,
                  tooltip: "Simulate Order From Supplier",
                  onClick: (event, rowData) =>
                    this.handleCheckBox(event, rowData)
                }
              ]}
            />
          ) : _.get(store, "storeId", null) ? (
            renderLoader()
          ) : (
            <Typography> No store selected! </Typography>
          )}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  productStocks: state.productStock.allProductStock,
  errors: state.errors
});

const mapDispatchToProps = {
  retrieveProductStocksByParameter,
  simulateReorderingFromSupplier
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withPage(ProductsStockTable, "Product Stock Management"))
);
