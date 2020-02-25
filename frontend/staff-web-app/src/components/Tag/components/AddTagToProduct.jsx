import React, { Component } from "react";
import PropTypes from "prop-types";
import MomentUtils from "@date-io/moment";
import { Grid } from "@material-ui/core";
import MaterialTextField from "../../../shared/components/Form/MaterialTextField";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import {
  addTagToProducts,
  createNewTag,
  retrieveAllTags,
  updateTag
} from "../../../redux/actions/tagAction";
import { Add, Check } from "@material-ui/icons";
import { clearErrors } from "../../../redux/actions";
import connect from "react-redux/es/connect/connect";
import withPage from "../../Layout/page/withPage";
import MaterialObjectSelect from "../../../shared/components/Form/MaterialObjectSelect";
import MaterialTable from "material-table";
import { ProductsTableRaw } from "../../Product/ProductsList/components/ProductsTable";
import { retrieveProductsDetails } from "../../../redux/actions/productActions";
import CreateUpdateTagRequest from "../../../models/CreateUpdateTagRequest";
import AddTagToProductsRequest from "../../../models/tag/AddTagToProductsRequest";

class AddTagToProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagId: ""
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
    const req = new AddTagToProductsRequest(this.state.tagId, data);
    this.props.addTagToProducts(req, this.props.history);
  };

  render() {
    const { errors, renderLoader } = this.props;
    console.log(this.props.allProducts);
    console.log(this.state.tagId);

    return (
      <React.Fragment>
        <div className="card__title">
          <h5 className="bold-text">Add Tag To Products</h5>
        </div>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <form className="material-form">
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
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

              <Grid item xs={12}>
                {this.props.allProducts ? (
                  <ProductsTableRaw
                    selectable={true}
                    products={this.props.allProducts.filter(
                      p =>
                        p.product.tags.filter(t => t.tagId === this.state.tagId)
                          .length === 0
                    )}
                    selectionAction={{
                      tooltip: "Add Tag To Products",
                      icon: Add,
                      onClick: (evt, data) =>
                        this.handleAddTagToProducts(evt, data)
                    }}
                  />
                ) : (
                  renderLoader()
                )}
              </Grid>
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
  retrieveProductsDetails
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withPage(AddTagToProduct, "Tag Management"));
