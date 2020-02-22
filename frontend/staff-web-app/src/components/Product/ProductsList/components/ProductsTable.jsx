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
  ViewColumn
} from "@material-ui/icons";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import PageviewOutlinedIcon from "@material-ui/icons/PageviewOutlined";
import {
  retrieveAllProducts,
  retrieveProductsDetails
} from "../../../../redux/actions/productActions";

const tableIcons = {
  Add: AddBox,
  Check: Check,
  Clear: Clear,
  Delete: DeleteOutline,
  DetailPanel: ChevronRight,
  Edit: Edit,
  Export: SaveAlt,
  Filter: FilterList,
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
    this.props.retrieveAllProducts();
  }

  handleViewProductDetails = id => {
    this.props.history.push(`/viewProductDetails/${id}`);
  };

  formatData = () => {};

  render() {
    const { products } = this.props;

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
          cost: product.cost,
          price: product.price,
          category: product.category.name,
          colours: colours,
          avatar: image
        };
      });
    }

    return (
      <div style={{ width: "auto", overflowX: "scroll" }}>
        {products && (
          <MaterialTable
            title="Basic Filtering Preview"
            icons={tableIcons}
            columns={[
              {
                title: "Avatar",
                field: "avatar",
                render: rowData => (
                  <Link to="/viewAllProduct">
                    <img
                      style={{ width: 36, borderRadius: "50%" }}
                      src={rowData.avatar}
                      onClick={() =>
                        console.log("You saved me" + rowData.avatar)
                      }
                    />
                  </Link>
                )
              },
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
                        style={{
                          color,
                          fontSize: 40
                        }}
                      />
                    );
                  })
              },
              {
                title: "Category",
                field: "category"
              }
            ]}
            data={data}
            options={{
              filtering: true,
              sorting: true,
              pageSize: 10,
              pageSizeOptions: [10, 20, 40],
              actionsColumnIndex: -1,
              headerStyle: { backgroundColor: "grey" } //change header padding
            }}
            actions={[
              {
                icon: PageviewOutlinedIcon,
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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProductsTable)
);
