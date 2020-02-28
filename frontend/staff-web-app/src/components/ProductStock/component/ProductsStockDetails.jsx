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
import { retrieveProductsDetails } from "../../../redux/actions/productActions";
import withPage from "../../Layout/page/withPage";
import colourList from "../../../scss/colours.json";
import makeStyles from "@material-ui/core/styles/makeStyles";

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

// const classes = useStyles();
// const useStyles = makeStyles(theme => ({
//     container: {
//         display: 'flex',
//         flexWrap: 'wrap',
//     },
//     formControl: {
//         margin: theme.spacing(1),
//         minWidth: 120,
//     },
// }));
//
// const [open, setOpen] = React.useState(false);
// const [Quantity, setQty] = React.useState('');
//
// const handleChange = event => {
//     setQty(Number(event.target.value) || '');
// };
//
// const handleClickOpen = () => {
//     setOpen(true);
// };
//
// const handleClose = () => {
//     setOpen(false);
// };

class ProductsStockDetails extends PureComponent {
  state = {
    id: "",
    redirect: false,
    productStock: []
  };

  componentDidMount() {
    if (this.props.retrieveProductsDetails)
      this.props.retrieveProductsDetails();
  }

  handleUpdateProductStock = id => {
    this.props.history.push(`/productStock/updateProductStock/${id}`);
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.currentProduct !== prevState.product) {
      this.setState({
        product: this.props.currentProduct.product,
        colourSizeMap: this.props.currentProduct.colourToSizeImageMaps
      });
    }
  }

  handleOpenProductStockUpdateDialog = e => {
    this.setState({ openProductStockUpdateDialog: true });
  };

  //formatData = () => {};

  render() {
    const { productStock, renderLoader, columnsToHide } = this.props;
    const { openProductStockUpdateDialog } = this.state;

    let data = [];
    if (productStock) {
      data = productStock.map(e => {
        const { product, colourToSizeImageMaps } = e;
        let image;
        const colours = colourToSizeImageMaps.map(e => {
          if (!image)
            image = e.productImages[0] && e.productImages[0].productImageUrl;
          return jsonColorHexList[e.colour].name;
        });
        return {
          productName: product.productName,
          sku: product.sku,
          colours: colours,
          sizes: product.sizes
        };
      });
    }

    return (
      // call retrieve product details and pass in warehouse/store id
      <div className="table" style={{ verticalAlign: "middle" }}>
        {productStock ? (
          <MaterialTable
            title="Product Stock Details"
            padding="none"
            style={{ boxShadow: "none" }}
            icons={tableIcons}
            columns={[
              { title: "SKU", field: "sku" },
              { title: "Name", field: "productName" },
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
                icon: Edit,
                tooltip: "Update Product Stock",
                onClick: (event, rowData) =>
                  this.handleOpenProductStockUpdateDialog(rowData.id)
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
  retrieveProductsDetails
};

export const ProductsTableRaw = withRouter(ProductsStockDetails);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withPage(ProductsStockDetails, "Product Stock Management"))
);
