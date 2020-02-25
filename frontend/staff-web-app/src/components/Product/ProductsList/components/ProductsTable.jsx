import React, { PureComponent } from "react";
import { Link, withRouter } from "react-router-dom";
import MaterialTable from "material-table";
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
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import { retrieveAllProducts } from "../../../../redux/actions/productActions";
import withPage from "../../../Layout/page/withPage";
import colourList from "../../../../scss/colours.json";
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
          if (!image)
            image = e.productImages[0] && e.productImages[0].productImageUrl;
          return jsonColorHexList[e.colour].name;
        });
        return {
          productId: product.productId,
          productName: product.productName,
          serialNumber: product.serialNumber,
          cost: product.cost,
          price: product.price,
          category: product.category.name,
          colours: colours,
          image: image
        };
      });
    }

    return (
      <div className="table" style={{ verticalAlign: "middle" }}>
        {products ? (
          <MaterialTable
            title="Products"
            padding="none"
            style={{ boxShadow: "none" }}
            icons={tableIcons}
            columns={[
              {
                title: "Image",
                field: "image",
                render: rowData => (
                  <Link to={`/product/viewProductDetails/${rowData.productId}`}>
                    <img
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "10%"
                      }}
                      src={rowData.image}
                      onClick={() =>
                        console.log("You saved me" + rowData.image)
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
                        style={{ color: jsonColorNameList[color].hex }}
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
              padding: "dense",
              pageSize: 5,
              pageSizeOptions: [5, 10, 20, 40],
              actionsColumnIndex: -1,
              headerStyle: { textAlign: "center" }, //change header padding
              cellStyle: { textAlign: "center" }
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
