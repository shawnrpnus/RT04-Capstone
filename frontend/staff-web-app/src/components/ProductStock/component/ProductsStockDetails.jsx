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
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { Col, Row } from "reactstrap";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
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

class ProductsStockDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      productId: this.props.selectedProductId,
      colourToSizeImageMaps: null,
      selectedProductVariant: 0,
      productStock: []
    };
  }

  componentDidMount = () => {
    const { products, selectedProductId } = { ...this.props };
    // // Getting product, leafNodeName, colourToSizeImageMaps
    const product = _.find(products, {
      product: { productId: selectedProductId }
    });
    const colourToSizeImageMaps = product.colourToSizeImageMaps;
    const defaultColour = colourToSizeImageMaps[0].colour;
    this.setState({
      colourToSizeImageMaps,
      selectedProductVariant: defaultColour
    });
  };

  onSelectColour = ({ target: input }) => {
    const selectedProductVariant = input.value;
    this.setState({ selectedProductVariant });
  };

  render() {
    const { renderLoader, onClose, open } = this.props;
    const { colourToSizeImageMaps, selectedProductVariant } = this.state;
    let list;
    let data = [];

    if (colourToSizeImageMaps) {
      list = _.keyBy([...colourToSizeImageMaps], "colour");

      data = list[selectedProductVariant].sizeMaps.map((e, index) => {
        return {
          sku: e.productStock.productVariant.sku,
          size: e.size,
          currentStock: e.productStock.quantity,
          productStockId: e.productStock.productStockId,
          sizeMapIndex: index,
          colour: selectedProductVariant
        };
      });
    }

    return (
      // call retrieve product details and pass in warehouse/store id
      <Dialog onClose={onClose} open={open} fullWidth maxWidth={"md"}>
        <DialogTitle>Product stock details</DialogTitle>
        <DialogContent
          style={{
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Row>
            <Col md={8}></Col>{" "}
            <Col md={4}>
              <Select
                value={selectedProductVariant}
                onChange={this.onSelectColour}
              >
                {colourToSizeImageMaps &&
                  colourToSizeImageMaps.map(e => {
                    const colour = e.colour;
                    return (
                      <MenuItem key={colour} value={colour}>
                        <FiberManualRecordIcon
                          style={{ color: colour, fontSize: 20 }}
                        />
                      </MenuItem>
                    );
                  })}
              </Select>
            </Col>
          </Row>

          <div className="table" style={{ verticalAlign: "middle" }}>
            {colourToSizeImageMaps ? (
              <MaterialTable
                title="Product Stock Details"
                padding="none"
                style={{ boxShadow: "none" }}
                icons={tableIcons}
                columns={[
                  { title: "SKU", field: "sku", editable: "never" },
                  { title: "Size", field: "size", editable: "never" },
                  {
                    title: "Current stock",
                    field: "currentStock"
                  }
                ]}
                data={data}
                options={{
                  filtering: true,
                  sorting: true,
                  padding: "dense",
                  pageSize: 5,
                  pageSizeOptions: [5, 10],
                  actionsColumnIndex: -1,
                  headerStyle: { textAlign: "center" }, //change header padding
                  cellStyle: { textAlign: "center" }
                }}
                editable={{
                  onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                      let colourToSizeImageMaps = {
                        ...this.state.colourToSizeImageMaps
                      };
                      colourToSizeImageMaps = _.keyBy(
                        colourToSizeImageMaps,
                        "colour"
                      );
                      colourToSizeImageMaps[oldData.colour].sizeMaps[
                        oldData.sizeMapIndex
                      ].productStock.quantity = Number(newData.currentStock);
                      colourToSizeImageMaps = _.toArray(colourToSizeImageMaps);
                      this.setState({ colourToSizeImageMaps }, () => resolve());
                    })
                }}
              />
            ) : (
              renderLoader()
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

// mapping the state of 'global store' to the props of the local component
const mapStateToProps = state => ({
  products: state.product.products,
  errors: state.errors
});

const mapDispatchToProps = {};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withPage(ProductsStockDetails, "Product Stock Management"))
);
