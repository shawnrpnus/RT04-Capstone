import React, { PureComponent } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
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
  Visibility
} from "@material-ui/icons";
import MaterialTable from "material-table";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import withPage from "../../Layout/page/withPage";
import ProductsStockDetails from "./ProductsStockDetails";
import { retrieveProductStocksByParameter } from "../../../redux/actions/productStockActions";
import Checkbox from "@material-ui/core/Checkbox";

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
    console.log(this.props);
    this.props.retrieveProductStocksByParameter(3);
  }

  handleCheckBox = (evt, data) => {
    evt.preventDefault();
    //data is the list of products selected

    this.state.selectedProductStocks.push(data);
  };

  render() {
    const { renderLoader } = this.props;

    console.log(this.props.productStocks);

    let data = [];
    if (this.props.productStocks) {
      data = this.props.productStocks.map(productStock => {
        return {
          productStockId: productStock.productStockId,
          productName: productStock.productVariant.product.productName,
          sku: productStock.productVariant.sku,
          quantity: productStock.quantity,
          image: productStock.productVariant.productImages[0].productImageUrl
        };
      });
    }

    return (
      <React.Fragment>
        <div className="table" style={{ verticalAlign: "middle" }}>
          {this.props.productStocks ? (
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
              //   actions={[
              //     {
              //       icon: Checkbox,
              //       tooltip: "View Product Stocks Details",
              //       onClick: (event, rowData) =>
              //         this.handleCheckBox(event, rowData)
              //     }
              //   ]}
            />
          ) : (
            renderLoader()
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
  retrieveProductStocksByParameter
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withPage(ProductsStockTable, "Product Stock Management"))
);
