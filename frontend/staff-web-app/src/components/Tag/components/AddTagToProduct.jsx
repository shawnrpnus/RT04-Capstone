import React, { Component } from "react";
import PropTypes from "prop-types";
import MomentUtils from "@date-io/moment";
import { Grid } from "@material-ui/core";
import MaterialTextField from "../../../shared/components/Form/MaterialTextField";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import {
  addTagToProducts,
  createNewTag,
  deleteTagFromProducts,
  retrieveAllTags,
  updateTag
} from "../../../redux/actions/tagAction";
import { Add, Check, Delete } from "@material-ui/icons";
import { clearErrors } from "../../../redux/actions";
import connect from "react-redux/es/connect/connect";
import withPage from "../../Layout/page/withPage";
import MaterialObjectSelect from "../../../shared/components/Form/MaterialObjectSelect";
import MaterialTable from "material-table";
import { ProductsTableRaw } from "../../Product/ProductsList/components/ProductsTable";
import { retrieveProductsDetails } from "../../../redux/actions/productActions";
import CreateUpdateTagRequest from "../../../models/CreateUpdateTagRequest";
import AddTagToProductsRequest from "../../../models/tag/AddTagToProductsRequest";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Col from "reactstrap/es/Col";
import Row from "react-data-grid/lib/Row";
import DeleteTagFromProductsRequest from "../../../models/tag/DeleteTagFromProductsRequest";
import Button from "@material-ui/core/Button";

const _ = require("lodash");

class AddTagToProduct extends Component {
  constructor(props) {
    super(props);
    this.handleChangeAddTo = this.handleChangeAddTo.bind(this);
    this.handleChangeViewAndDelete = this.handleChangeViewAndDelete.bind(this);
    this.state = {
      tagId: "",
      mode: true
    };
  }

  componentDidMount() {
    this.props.retrieveAllTags();
    this.props.retrieveProductsDetails();
  }

  onChange = e => {
    const name = e.target.name;
    this.setState({ [name]: e.target.value }); //computed property name syntax

    if (Object.keys(this.props.errors).length !== 0) {
      this.props.clearErrors();
    }
  };

  handleAddTagToProducts = (evt, data) => {
    evt.preventDefault();
    //data is the list of products selected
    console.log(data);
    console.log(data[0].productId);
    let productIds = [];
    data.forEach(element => {
      // console.log(element.productId);
      productIds.push(element.productId);
    });
    const req = new AddTagToProductsRequest(this.state.tagId, productIds);
    this.props.addTagToProducts(req, this.props.history);
  };

  handleDeleteTagFromProducts = (evt, data) => {
    evt.preventDefault();
    let productIds = [];
    data.forEach(element => {
      // console.log(element.productId);
      productIds.push(element.productId);
    });
    const req = new DeleteTagFromProductsRequest(this.state.tagId, productIds);
    this.props.deleteTagFromProducts(req, this.props.history);
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
                <h5 className="bold-text">Add Tag To Products</h5>
              ) : (
                <h5 className="bold-text">Delete Tag From Products</h5>
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
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <form className="material-form">
            <Grid container spacing={3}>
              <Grid item xs={12} md={2}>
                {this.props.allTags ? (
                  <MaterialObjectSelect
                    fieldName="tagId"
                    fieldLabel="Select Tag"
                    onChange={this.onChange}
                    state={this.state}
                    objects={this.props.allTags}
                    objectFieldForValue="tagId"
                    objectFieldForKey="tagId"
                    objectFieldToDisplay="name"
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
                          p.product.tags.filter(
                            t => t.tagId === this.state.tagId
                          ).length === 0
                      )}
                      selectionAction={{
                        tooltip: "Add Tag To Products",
                        icon: Add,
                        onClick: (evt, data) =>
                          this.handleAddTagToProducts(evt, data)
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
                          p.product.tags.filter(
                            t => t.tagId === this.state.tagId
                          ).length !== 0
                      )}
                      selectionAction={
                        salesmarketing
                          ? {
                              tooltip: "Delete Tag From Products",
                              icon: Delete,
                              onClick: (evt, data) =>
                                this.handleDeleteTagFromProducts(evt, data)
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
        </MuiPickersUtilsProvider>
      </React.Fragment>
    );
  }
}

//mapping global state to this component
const mapStateToProps = state => ({
  currentTag: state.tag.currentTag,
  allTags: state.tag.allTags,
  errors: state.errors,
  allProducts: state.product.products
});

const mapDispatchToProps = {
  addTagToProducts,
  retrieveAllTags,
  retrieveProductsDetails,
  clearErrors,
  deleteTagFromProducts
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withPage(AddTagToProduct, "Tag Management"));
