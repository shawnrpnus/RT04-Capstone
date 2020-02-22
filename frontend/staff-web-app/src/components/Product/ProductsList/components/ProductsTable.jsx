import React, { PureComponent } from "react";
import { Link, withRouter } from "react-router-dom";
import MaterialTable from "material-table";
import { connect } from "react-redux";
import {
  AddBox,
  ArrowUpward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn,
  Visibility
} from "@material-ui/icons";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import PageviewOutlinedIcon from "@material-ui/icons/PageviewOutlined";
import {
  retrieveAllProducts,
  retrieveProductsDetails
} from "../../../../redux/actions/productActions";
import withPage from "../../../Layout/page/withPage";

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
  SortArrow: ArrowUpward,
  ThirdStateCheck: Remove,
  ViewColumn: ViewColumn
};

class ProductsTable extends PureComponent {
  state = {
    id: "",
    redirect: false,
    products: []
  };

  componentDidMount() {
    if (this.props.retrieveAllProducts) this.props.retrieveAllProducts();
  }

  handleViewProductDetails = id => {
    this.props.history.push(`/product/viewProductDetails/${id}`);
  };

  formatData = () => {};

  render() {
    const { products, renderLoader, columnsToHide } = this.props;

    let data = [];
    if (products) {
      data = products.map(e => {
        const { product, colourToSizeImageMaps } = e;
        let image;
        const colours = colourToSizeImageMaps.map(e => {
          image = e.productImages[0] && e.productImages[0].productImageUrl;
          return e.colour;
        });
        return {
          productId: product.productId,
          productName: product.productName,
          serialNumber: product.serialNumber,
          cost: product.cost,
          price: product.price,
          category: product.category.name,
          colours: colours,
          avatar: image
        };
      });
    }

    return (
      <div className="table" style={{ verticalAlign: "middle" }}>
        {products ? (
          <MaterialTable
            title="All Products"
            style={{ boxShadow: "none" }}
            icons={tableIcons}
            columns={[
              {
                title: "Avatar",
                field: "avatar",
                render: rowData => (
                  <Link to="/viewAllProduct">
                    <img
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "10%"
                      }}
                      src={rowData.avatar}
                      onClick={() =>
                        console.log("You saved me" + rowData.avatar)
                      }
                    />
                  </Link>
                )
              },
              { title: "Serial No.", field: "serialNumber" },
              { title: "Name", field: "productName" },
              { title: "Cost", field: "cost", type: "currency" },
              { title: "Price", field: "price", type: "currency" },
              {
                title: "Colours",
                field: "colours",
                render: rowData =>
                  rowData.colours.map((color, index) => {
                    return (
                      <FiberManualRecordIcon
                        key={color + index}
                        style={{ color }}
                      />
                    );
                  })
              },
              {
                title: "Category",
                field: "category",
                hidden:
                  Array.isArray(columnsToHide) &&
                  columnsToHide.includes("category")
              }
            ]}
            data={data}
            options={{
              filtering: true,
              sorting: true,
              pageSize: 5,
              pageSizeOptions: [5, 10, 20, 40],
              actionsColumnIndex: -1
              // headerStyle: { backgroundColor: "grey" } //change header padding
            }}
            actions={[
              {
                icon: Visibility,
                tooltip: "View Product Variants",
                onClick: (event, rowData) =>
                  this.handleViewProductDetails(rowData.productId)
              }
              // rowData => ({
              //   icon: 'delete',
              //   tooltip: 'Delete User',
              //   onClick: (event, rowData) => confirm("You want to delete " + rowData.name),
              //   disabled: rowData.birthYear < 2000
              // })
            ]}
          />
        ) : (
          renderLoader()
        )}
      </div>
    );
  }
}

// mapping the state of 'global store' to the props of the local component
const mapStateToProps = state => ({
  products: state.product.products,
  errors: state.errors
});

const mapDispatchToProps = {
  retrieveAllProducts
};

export const ProductsTableRaw = withRouter(ProductsTable);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withPage(ProductsTable, "Product Management"))
);
