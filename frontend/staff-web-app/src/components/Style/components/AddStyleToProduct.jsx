import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import {
  addStyleToProducts,
  deleteStyleFromProducts,
  retrieveAllStyles
} from "../../../redux/actions/styleAction";
import { Add, Delete } from "@material-ui/icons";
import { clearErrors } from "../../../redux/actions";
import connect from "react-redux/es/connect/connect";
import withPage from "../../Layout/page/withPage";
import MaterialObjectSelect from "../../../shared/components/Form/MaterialObjectSelect";
import { ProductsTableRaw } from "../../Product/ProductsList/components/ProductsTable";
import { retrieveProductsDetails } from "../../../redux/actions/productActions";
import AddStyleToProductsRequest from "../../../models/style/AddStyleToProductsRequest";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import DeleteStyleFromProductsRequest from "../../../models/style/DeleteStyleFromProductsRequest";
import Button from "@material-ui/core/Button";
import withMaterialConfirmDialog from "./../../Layout/page/withMaterialConfirmDialog";

const _ = require("lodash");

class AddStyleToProduct extends Component {
  constructor(props) {
    super(props);
    this.handleChangeAddTo = this.handleChangeAddTo.bind(this);
    this.handleChangeViewAndDelete = this.handleChangeViewAndDelete.bind(this);
    this.state = {
      styleId: "",
      mode: true
    };
  }

  componentDidMount() {
    this.props.retrieveAllStyles();
    this.props.retrieveProductsDetails();
  }

  onChange = e => {
    this.setState({ styleId: e.target.value });
    if (Object.keys(this.props.errors).length !== 0) {
      this.props.clearErrors();
    }
  };

  handleAddStyleToProducts = (evt, data) => {
    evt.preventDefault();
    //data is the list of products selected
    console.log(data);
    console.log(data[0].productId);
    let productIds = [];
    data.forEach(element => {
      // console.log(element.productId);
      productIds.push(element.productId);
    });
    const styleId = this.state.styleId;
    const req = new AddStyleToProductsRequest(styleId, productIds);
    this.props.addStyleToProducts(req, this.props.history);
  };

  handleDeleteStyleFromProducts = (evt, data) => {
    evt.preventDefault();
    let productIds = [];
    data.forEach(element => {
      // console.log(element.productId);
      productIds.push(element.productId);
    });
    const req = new DeleteStyleFromProductsRequest(
      this.state.styleId,
      productIds
    );
    this.props
      .confirmDialog({
        description: "Style will be deleted for the selected products."
      })
      .then(() => this.props.deleteStyleFromProducts(req, this.props.history));
  };

  handleChangeAddTo() {
    this.setState({ mode: true });
  }
  handleChangeViewAndDelete() {
    this.setState({ mode: false });
  }

  render() {
    const { errors, renderLoader, store } = this.props;
    const salesmarketing =
      _.get(this.props, "staff.department.departmentName") ===
      "Sales and Marketing";

    return (
      <React.Fragment>
        <div className="card__title">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {this.state.mode ? (
                <h5 className="bold-text">Add Style To Products</h5>
              ) : (
                <h5 className="bold-text">Delete Style From Products</h5>
              )}
            </Grid>
            <Grid item xs={12} md={3} />
            <Grid item xs={12} md={3}>
              {salesmarketing && (
                <ButtonGroup color="primary">
                  <Button
                    onClick={this.handleChangeAddTo}
                    variant={this.state.mode ? "contained" : "outlined"}
                  >
                    Add
                  </Button>
                  <Button
                    onClick={this.handleChangeViewAndDelete}
                    variant={this.state.mode ? "outlined" : "contained"}
                  >
                    View/Delete
                  </Button>
                </ButtonGroup>
              )}
            </Grid>
          </Grid>
        </div>
        <form className="material-form">
          <Grid container spacing={3}>
            <Grid item xs={12} md={2}>
              {this.props.allStyles ? (
                <MaterialObjectSelect
                  fieldName="styleId"
                  fieldLabel="Select Style"
                  onChange={this.onChange}
                  state={this.state}
                  objects={this.props.allStyles}
                  objectFieldForValue="styleId"
                  objectFieldForKey="styleId"
                  objectFieldToDisplay="styleName"
                />
              ) : null}
            </Grid>
            {this.state.mode && salesmarketing ? (
              <Grid item xs={12}>
                {this.props.allProducts ? (
                  <ProductsTableRaw
                    selectable={true}
                    products={this.props.allProducts.filter(
                      p =>
                        p.product.styles.filter(
                          t => t.styleId === this.state.styleId
                        ).length === 0
                    )}
                    selectionAction={{
                      tooltip: "Add Style To Products",
                      icon: Add,
                      onClick: (evt, data) =>
                        this.handleAddStyleToProducts(evt, data)
                    }}
                    {...this.props}
                  />
                ) : (
                  renderLoader()
                )}
              </Grid>
            ) : (
              <Grid item xs={12}>
                {this.props.allProducts ? (
                  <ProductsTableRaw
                    selectable={salesmarketing ? true : false}
                    products={this.props.allProducts.filter(
                      p =>
                        p.product.styles.filter(
                          t => t.styleId === this.state.styleId
                        ).length !== 0
                    )}
                    selectionAction={
                      salesmarketing
                        ? {
                            tooltip: "Delete Style From Products",
                            icon: Delete,
                            onClick: (evt, data) =>
                              this.handleDeleteStyleFromProducts(evt, data)
                          }
                        : true
                    }
                    {...this.props}
                  />
                ) : (
                  renderLoader()
                )}
              </Grid>
            )}
          </Grid>
        </form>
      </React.Fragment>
    );
  }
}

//mapping global state to this component
const mapStateToProps = state => ({
  allStyles: state.style.allStyles,
  errors: state.errors,
  allProducts: state.product.products
});

const mapDispatchToProps = {
  addStyleToProducts,
  retrieveAllStyles,
  clearErrors,
  retrieveProductsDetails,
  deleteStyleFromProducts
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withMaterialConfirmDialog(withPage(AddStyleToProduct, "Style Management")));
